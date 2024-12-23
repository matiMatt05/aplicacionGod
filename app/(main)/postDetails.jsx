import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { createComment, fetchPostDetails, removeComment } from '../../services/postService';
import { wp, hp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import PostCard from '../../components/PostCard';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/Loading';
import Input from '../../components/Input';
import Icon from '../../assets/icons';
import CommentItem from '../../components/CommentItem';
import { filter, remove } from 'ramda';
import { supabase } from '../../lib/supabase';
import { getUserData } from '../../services/userService';

const PostDetails = () => {
    const {postId} = useLocalSearchParams();
    const {user} = useAuth();
    const router = useRouter();
    const [startLoading, setStartLoading] = useState(true); 
    const inputRef = useRef(null);
    const commentRef = useRef('');
    const [loading, setLoading] = useState(false);
    console.log('got post Id: ', postId); 
    
    const [post, setPost] = useState(null);


    const handleNewComment = async (payload)=>{
        console.log('got new comment', payload.new);
        if(payload.new){
            let newComment = {...payload.new};
            let res = await getUserData(newComment.userId);
            newComment.user = res.success? res.data: {};
            setPost(prevPost=>{
                return {
                    ...prevPost,
                    comments: [newComment, ...prevPost.comments]
                }
            })
        }
    }

    useEffect(()=>{
        let commentChannel = supabase
        .channel('comments')
        .on('postgres_changes', {
            event: 'INSERT', 
            schema: 'public',
            table: 'comments',
            filter: `postId=eq.${postId}`
        }, handleNewComment)
        .subscribe();
        
        getPostDetails();

        return ()=>{
            supabase.removeChannel(commentChannel);
        }
    }, [])


    const getPostDetails = async () => {
        // fetch post details here
        let res = await fetchPostDetails(postId);
        if(res.success) setPost(res.data);
        setStartLoading(false);
    }

    const onNewComment = async ()=>{
        if(!commentRef.current) return null;
        let data = {
            userId: user?.id,
            postId: post?.id,
            text: commentRef.current
        }
        //create comment
        setLoading(true);
        let res = await createComment(data);
        setLoading(false);
        if(res.success){
            //send notification later
            inputRef?.current?.clear();
            commentRef.current = "";
        }else{
            Alert.alert('Comment', res.msg);
        }
    }

    if(startLoading){
        return (
            <View style={styles.center}>
                <Loading />
            </View>
        )
    }

    const onDeleteComment = async (comment) => {
        console.log('comment delete:', comment);
        let res = await removeComment(comment?.id);
        if(res.success){
            setPost(prevPost=>{
                let updatedPost = {...prevPost};
                updatedPost.comments = updatedPost.comments.filter(c=> c.id != comment.id);
                return updatedPost;
            })
        }else{
            Alert.alert('Comment', res.msg);
        }
    }

    if(!post){
        return (
            <View style={[styles.center, {justifyContent: 'flex-start', marginTop: 100}]}>
                <Text style={styles.notFound} >
                    Post not found !
                </Text>
            </View>
        )
    }
    return (
        <View style={styles.container} >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
                <PostCard
                    item={{...post, comments: [{count: post?.comments?.length,}]}}
                    currentUser={user}
                    router={router}
                    hasShadow={false}
                    showMoreIcon = {false}
                />

                {/* comment input */}
                <View style={styles.inputContainer}>
                    <Input
                        inputRef={inputRef}
                        placeholder="Type comment..."
                        onChangeText={value=> commentRef.current = value}
                        placeholderTextColor = {theme.colors.textLight}
                        containerStyle = {{ flex: 1, height: hp(6.2), borderRadius: theme.radius.xl}}
                    />
                    {
                        loading? (
                            <View style={styles.loading} >
                                <Loading size='small' />
                            </View>
                        ):(
                            <TouchableOpacity style={styles.sendIcon} onPress={onNewComment} >
                                <Icon name="send" color={theme.colors.primaryDark} />
                            </TouchableOpacity>
                        )
                    }
                    
                </View>

                {/* comment list */}
                <View style={{marginVertical: 15, gap: 17}}>
                    {
                        post?.comments?.map(comment=>
                            <CommentItem
                                key={comment?.id?.toString()}
                                item={comment}
                                onDelete={onDeleteComment}
                                canDelete = {user.id == comment.userId || user.id == post.userId }
                            />
                        )
                    }
                    {
                        post?.comments?.length === 0 && (
                            <Text style={{color: theme.colors.text, marginLeft: 5}}>
                                primer comentario
                            </Text>
                        )
                    }
                </View>
            </ScrollView>
        </View>
    )
}

export default PostDetails

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: wp(7)
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    list: {
        paddingHorizontal: wp(4),
    },
    sendIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.8,
        borderColor: theme.colors.primary,
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
        height: hp(5.8),
        width: hp(5.8),
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    notFound: {
        fontSize: hp(2.5),
        color: theme.colors.text,
        fontWeight: theme.fonts.medium,
    },
    Loading: {
        height: hp(5.8),
        width: hp(5.8),
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{scale: 1.3}]
    }
})