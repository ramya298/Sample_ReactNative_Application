import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder } from 'react-native';
import { Card, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';
import Icon from 'react-native-vector-icons/FontAwesome';
import { postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';


const recognizeComment = ({ moveX, moveY, dx, dy }) => {
    if ( dx > 0 )
        return true;
    else
        return false;
}


const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}
const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId,rating,author,comment) => dispatch(postComment(dishId,rating,author,comment)),
})

function RenderDish(props) {

    const dish = props.dish;

    const panResponder = PanResponder.create({
        onMoveShouldSetResponderCapture: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderMove: (e, gestureState) => {
            if (recognizeComment(gestureState)){
                {props.onSwipe()}
            }
            return true;
        },
    })
    

    if (dish != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
            ref={this.handleViewRef}
            {...panResponder.panHandlers}>
            <Card
                featuredTitle={dish.name}
                image={{ uri: baseUrl + dish.image }}>

                <Text style={{ margin: 10 }}>
                    {dish.description}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Icon
                        raised
                        reverse
                        name={props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        size={42}
                        onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                    />
                    <Icon
                        raised
                        reverse
                        name={'pencil'}
                        type='font-awesome'
                        color='#512DA8'
                        size={42}
                        onPress={() =>  props.onPress()}
                    />
                </View>
            </Card>
            </Animatable.View>

        );
    }
    else {
        return (<View></View>);
    }
}

function RenderComments(props) {

    const comments = props.comments;
    const renderCommentItem = ({ item, index }) => {

        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    }
    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>        

        <Card
            title='Comments'>
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
        </Animatable.View>
    );
}

class DishDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showModal: false,
            rating:0,
            author: ' ',
            usercomments: ' ',
        }
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }
    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }
    handleComment(dishId){
        this.toggleModal(); 
        this.props.postComment(dishId,this.state.rating,this.state.author,this.state.usercomments)
    }

    static navigationOptions = {
        title: 'Dish Details'
    };
    
    ratingCompleted = (rating) => { 
        this.setState ({ rating: rating  })
    };

   
    render() {
        console.disableYellowBox = true
        const dishId = this.props.navigation.getParam('dishId', '');

        return (
            <ScrollView>
                <Modal animationType={"slide"} transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => this.toggleModal()}
                    onRequestClose={() => this.toggleModal()}>
                    <View style={styles.modal}>
                        <Rating showRating startingValue="{0.0}" ratingColor='yellow'fractions={1}
                            onFinishRating={this.ratingCompleted} />

                        <Input
                            placeholder='Author'
                            leftIcon={
                                <Icon
                                    name='user'
                                    size={24}
                                    color='black'
                                />
                            }
                            onChangeText={(author) => this.setState({ author })}
                        />

                        <Input
                            placeholder='Comment'
                            leftIcon={
                                <Icon
                                    name='comment'
                                    size={24}
                                    color='black'
                                />
                            }
                            onChangeText={(usercomments) => this.setState({ usercomments })}
                        />


                        <View style={{ marginTop: 40 }} />
                        <Button
                            onPress={() => { 
                                this.handleComment(dishId);
                            }}
                            color="#512DA8"
                            title="Submit"
                        />
                        <View style={{ marginTop: 40 }} />
                        <Button
                            onPress={() => { this.toggleModal() }}
                            color='grey'
                            title="Cancel"
                        />
                    </View>
                </Modal>

                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => { (this.markFavorite(dishId)) || (this.toggleModal())}}
                    onSwipe={()=>(this.toggleModal())}
                />

                 <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                

            </ScrollView>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);


const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});