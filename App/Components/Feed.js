import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { getPopularPhotos } from '../API/Unsplash.js';
import { material } from 'react-native-typography';
import { Metrics } from '../Themes';
import FeedItem from '../Components/FeedItem';
import { Entypo } from '@expo/vector-icons';

export default class Feed extends React.Component {

  static defaultProps = { content: null }

  /* The HomeScreen.js file is in charge of passing this prop */
  /* This prop will be a function that is called when a profile is requested */
  static propTypes = {
    content: PropTypes.array,
    listHeaderComponent: PropTypes.object,
    onProfileRequested: PropTypes.func
  }

  state = {
    loading: false,
    feedEntries: [],
  }

  componentDidMount(){
    if (this.props.content) {
      this.setState({feedEntries: this.props.content});
    } else {
      // Part 1.1
      this.getFeedData();
    }
  }

  getFeedData = () => {
    this.setState({loading: true});
    getPopularPhotos(json => { //this code will be fetching images from the Unsplash API
      this.setState({feedEntries: json, loading: false});
    });
  }

  onProfilePressed = (username) => {
    /* call the prop*/
    /* make sure that the prop is not null first by using an if statement*/
    /* when calling the prop function, pass the username to it */
    //sample call to a function inside of props: this.props.myFunction('someParameterString');  
    if (username != null){
      this.props.onProfileRequested(username);
    }
  }

  //here's a simple key extractor which uses the item's ID as a unique value indicator
  _keyExtractor = (item, index) => item.id;

  renderItem = ({item}) => {
    /* Render the FeedItem*/
    /* FeedItem props: content and onProfilePressed */
    /* Important spec: pass the function this.onProfilePressed to the FeedItem prop ^ */
    return (
        <FeedItem content={item.value} onProfilePressed={this.onProfilePressed}/>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.getTabContent()}
      </View>
    );
  }

  getTabContent = () => {
    const { loading } = this.state;

    if (loading) {
      return (
        <ActivityIndicator />
      );
    } else {
      /* The data source will come from your state */
      /* Research the ListHeaderComponent prop for FlatList */
      /* NOTE: that Feed.js accepts a prop called 'listHeaderComponent', which is what you should render as a header here. */
      let data = [];
            for (var i = 0; i < this.state.feedEntries.length; i++) {
                data.push({key: i, value: this.state.feedEntries[i]});
            }

      return (

        //<Text style={{margin: 20}}>Put your list here!</Text>
        <FlatList
          //ref={(flatList)=>this._flatList = flatList}
          listHeaderComponent={this.props.listHeaderComponent}
          renderItem={this.renderItem}
          data={data}>
        </FlatList>

      );
    }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
