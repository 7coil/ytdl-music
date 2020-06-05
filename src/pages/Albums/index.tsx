import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ListView } from 'react-uwp/ListView';
import { TextBox } from 'react-uwp/TextBox';
import { DropDownMenu } from 'react-uwp/DropDownMenu';
import { AlbumInterface } from '../../class/Album';
import { PageContainer } from '../../components/PageContainer';
import { RootStateInterface } from '../../components/ReduxProvider';
import { displayYouTube } from '../../helpers/displayYouTube';
import { defaultGenres } from '../../helpers/genres';

const PLEASE_SELECT = '';

const mapStateToProps = (state: RootStateInterface) => {
  const { albums } = state;
  return { albums };
}
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

class AlbumsPage extends Component<PropsFromRedux, { selectedAlbum: AlbumInterface, overwriteArtist: string, overwriteAlbumTitle: string, genre: string }> {
  private overwriteAlbumTitleRef = React.createRef<TextBox>();
  private overwriteArtistRef = React.createRef<TextBox>();

  constructor(props) {
    super(props);

    this.handleArtistOverrideChange = this.handleArtistOverrideChange.bind(this);
    this.handleAlbumTitleOverrideChange = this.handleAlbumTitleOverrideChange.bind(this);
    this.handleGenreChange = this.handleGenreChange.bind(this);

    this.state = {
      selectedAlbum: {"title":"Hotel Del Luna OST","artist":"Various Artists","songs":[{"id":"EhdRQy1nM3VjOUhWa3xRQy1nM3VjOUhWayAcKAE%3D","title":"Another Day","album":"Hotel Del Luna OST","date":"2019-08-31","trackNumber":1,"artist":"Punch, Monday Kiz","videoID":"QC-g3uc9HVk","audioID":"QC-g3uc9HVk","albumCovers":[{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w60-h60-l90-rj","width":60,"height":60},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w120-h120-l90-rj","width":120,"height":120},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w180-h180-l90-rj","width":180,"height":180},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w226-h226-l90-rj","width":226,"height":226},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w302-h302-l90-rj","width":302,"height":302},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w544-h544-l90-rj","width":544,"height":544}]},{"id":"Ehd0NmltS3VkYjI4a3x0NmltS3VkYjI4ayAcKAE%3D","title":"Lean on me","album":"Hotel Del Luna OST","date":"2019-08-31","trackNumber":2,"artist":"10cm","videoID":"t6imKudb28k","audioID":"t6imKudb28k","albumCovers":[{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w60-h60-l90-rj","width":60,"height":60},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w120-h120-l90-rj","width":120,"height":120},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w180-h180-l90-rj","width":180,"height":180},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w226-h226-l90-rj","width":226,"height":226},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w302-h302-l90-rj","width":302,"height":302},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w544-h544-l90-rj","width":544,"height":544}]},{"id":"Ehc0bE5UNGlmYzltVXw0bE5UNGlmYzltVSAcKAE%3D","title":"All about you","album":"Hotel Del Luna OST","date":"2019-08-31","trackNumber":3,"artist":"TAEYEON","videoID":"4lNT4ifc9mU","audioID":"4lNT4ifc9mU","albumCovers":[{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w60-h60-l90-rj","width":60,"height":60},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w120-h120-l90-rj","width":120,"height":120},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w180-h180-l90-rj","width":180,"height":180},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w226-h226-l90-rj","width":226,"height":226},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w302-h302-l90-rj","width":302,"height":302},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w544-h544-l90-rj","width":544,"height":544}]},{"id":"EhdXenFvVXZPM0lUa3xJc2dhUVppY0RmayAcKAE%3D","title":"Only You","album":"Hotel Del Luna OST","date":"2019-08-31","trackNumber":4,"artist":"Yang Da Il","videoID":"WzqoUvO3ITk","audioID":"IsgaQZicDfk","albumCovers":[{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w60-h60-l90-rj","width":60,"height":60},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w120-h120-l90-rj","width":120,"height":120},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w180-h180-l90-rj","width":180,"height":180},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w226-h226-l90-rj","width":226,"height":226},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w302-h302-l90-rj","width":302,"height":302},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w544-h544-l90-rj","width":544,"height":544}]},{"id":"EhdDSklBQm90d3QwVXxDSklBQm90d3QwVSAcKAE%3D","title":"Can You See My Heart","album":"Hotel Del Luna OST","date":"2019-08-31","trackNumber":5,"artist":"Heize","videoID":"CJIABotwt0U","audioID":"CJIABotwt0U","albumCovers":[{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w60-h60-l90-rj","width":60,"height":60},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w120-h120-l90-rj","width":120,"height":120},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w180-h180-l90-rj","width":180,"height":180},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w226-h226-l90-rj","width":226,"height":226},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w302-h302-l90-rj","width":302,"height":302},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w544-h544-l90-rj","width":544,"height":544}]},{"id":"EhdBN3VnT2VqODlUTXxBN3VnT2VqODlUTSAcKAE%3D","title":"At The End","album":"Hotel Del Luna OST","date":"2019-08-31","trackNumber":6,"artist":"CHUNG HA","videoID":"A7ugOej89TM","audioID":"A7ugOej89TM","albumCovers":[{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w60-h60-l90-rj","width":60,"height":60},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w120-h120-l90-rj","width":120,"height":120},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w180-h180-l90-rj","width":180,"height":180},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w226-h226-l90-rj","width":226,"height":226},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w302-h302-l90-rj","width":302,"height":302},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w544-h544-l90-rj","width":544,"height":544}]},{"id":"EhdfalRrbXZpaTNvd3xfalRrbXZpaTNvdyAcKAE%3D","title":"Remember me","album":"Hotel Del Luna OST","date":"2019-08-31","trackNumber":7,"artist":"Gummy","videoID":"_jTkmvii3ow","audioID":"_jTkmvii3ow","albumCovers":[{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w60-h60-l90-rj","width":60,"height":60},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w120-h120-l90-rj","width":120,"height":120},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w180-h180-l90-rj","width":180,"height":180},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w226-h226-l90-rj","width":226,"height":226},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w302-h302-l90-rj","width":302,"height":302},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w544-h544-l90-rj","width":544,"height":544}]},{"id":"EhdTN01DYWFKTjFoTXxTN01DYWFKTjFoTSAcKAE%3D","title":"See the stars","album":"Hotel Del Luna OST","date":"2019-08-31","trackNumber":8,"artist":"Red Velvet","videoID":"S7MCaaJN1hM","audioID":"S7MCaaJN1hM","albumCovers":[{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w60-h60-l90-rj","width":60,"height":60},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w120-h120-l90-rj","width":120,"height":120},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w180-h180-l90-rj","width":180,"height":180},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w226-h226-l90-rj","width":226,"height":226},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w302-h302-l90-rj","width":302,"height":302},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w544-h544-l90-rj","width":544,"height":544}]},{"id":"Ehd4QU5qMDZDMXd6QXx4QU5qMDZDMXd6QSAcKAE%3D","title":"Can you hear me?","album":"Hotel Del Luna OST","date":"2019-08-31","trackNumber":9,"artist":"BEN","videoID":"xANj06C1wzA","audioID":"xANj06C1wzA","albumCovers":[{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w60-h60-l90-rj","width":60,"height":60},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w120-h120-l90-rj","width":120,"height":120},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w180-h180-l90-rj","width":180,"height":180},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w226-h226-l90-rj","width":226,"height":226},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w302-h302-l90-rj","width":302,"height":302},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w544-h544-l90-rj","width":544,"height":544}]},{"id":"EhdlUU5fNVFfZ2pBVXxkcVZHOGI2dk1YSSAcKAE%3D","title":"So long","album":"Hotel Del Luna OST","date":"2019-08-31","trackNumber":10,"artist":"Paul Kim","videoID":"eQN_5Q_gjAU","audioID":"dqVG8b6vMXI","albumCovers":[{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w60-h60-l90-rj","width":60,"height":60},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w120-h120-l90-rj","width":120,"height":120},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w180-h180-l90-rj","width":180,"height":180},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w226-h226-l90-rj","width":226,"height":226},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w302-h302-l90-rj","width":302,"height":302},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w544-h544-l90-rj","width":544,"height":544}]},{"id":"EhdpcU8wd2ZHdlpMY3wwdVV0V2xZUkxaWSAcKAE%3D","title":"Say Goodbye","album":"Hotel Del Luna OST","date":"2019-08-31","trackNumber":11,"artist":"Ha Yea Song","videoID":"iqO0wfGvZLc","audioID":"0uUtWlYRLZY","albumCovers":[{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w60-h60-l90-rj","width":60,"height":60},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w120-h120-l90-rj","width":120,"height":120},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w180-h180-l90-rj","width":180,"height":180},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w226-h226-l90-rj","width":226,"height":226},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w302-h302-l90-rj","width":302,"height":302},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w544-h544-l90-rj","width":544,"height":544}]},{"id":"EhdyMFJqTUlmWFNla3xyMFJqTUlmWFNlayAcKAE%3D","title":"Done For Me","album":"Hotel Del Luna OST","date":"2019-08-31","trackNumber":12,"artist":"Punch","videoID":"r0RjMIfXSek","audioID":"r0RjMIfXSek","albumCovers":[{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w60-h60-l90-rj","width":60,"height":60},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w120-h120-l90-rj","width":120,"height":120},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w180-h180-l90-rj","width":180,"height":180},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w226-h226-l90-rj","width":226,"height":226},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w302-h302-l90-rj","width":302,"height":302},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w544-h544-l90-rj","width":544,"height":544}]},{"id":"EhdoRlhGUWFqeU11SXxoRlhGUWFqeU11SSAcKAE%3D","title":"Love Deluna","album":"Hotel Del Luna OST","date":"2019-08-31","trackNumber":13,"artist":"Punch, Taeyong","videoID":"hFXFQajyMuI","audioID":"hFXFQajyMuI","albumCovers":[{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w60-h60-l90-rj","width":60,"height":60},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w120-h120-l90-rj","width":120,"height":120},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w180-h180-l90-rj","width":180,"height":180},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w226-h226-l90-rj","width":226,"height":226},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w302-h302-l90-rj","width":302,"height":302},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w544-h544-l90-rj","width":544,"height":544}]}],"albumCovers":[{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w60-h60-l90-rj","width":60,"height":60},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w120-h120-l90-rj","width":120,"height":120},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w180-h180-l90-rj","width":180,"height":180},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w226-h226-l90-rj","width":226,"height":226},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w302-h302-l90-rj","width":302,"height":302},{"url":"https://lh3.googleusercontent.com/3GE4EapcmBgrH_OgYsM3vD1iTpNSNRc5QyIgky3uEY0JiZyA2fI22M7y0N5lA1vMPvMJFBmihkFbU7mf=w544-h544-l90-rj","width":544,"height":544}],"releaseYear":2019,"releaseMonth":8,"releaseDay":31},
      overwriteArtist: '',
      overwriteAlbumTitle: '',
      genre: '',
    }
  }
  componentDidMount() {
    displayYouTube(false);
  }
  handleArtistOverrideChange(value: string) {
    this.setState({
      overwriteArtist: value
    })
  }
  handleAlbumTitleOverrideChange(value: string) {
    this.setState({
      overwriteAlbumTitle: value
    })
  }
  handleGenreChange(value: string) {
    this.setState({
      genre: value
    })
  }
  render() {
    const { albums } = this.props.albums;
    const { selectedAlbum } = this.state

    let extraGenres = [] as string[];
    
    try {
      if (window.localStorage.getItem('genres')) {
        extraGenres = JSON.parse(window.localStorage.getItem('genres')) as string[]
      }
    } catch(e) {
      window.localStorage.setItem('genres', '[]')
    }

    return (
      <PageContainer>
        <h1>Discovered Albums</h1>
        {
          albums.length === 0 &&
          <p>
            There are no albums to view
          </p>
        }
        {
          albums.length > 0 &&
          <ListView
            listSource={
              albums.map((album, index) => <p key={index}>{album.title}<br />{album.artist}</p>)
            }
            onChooseItem={(index) => {
              const newAlbum = albums[index];

              const isBySingleArtist = newAlbum.songs.every(song => song.artist === newAlbum.songs[0].artist);
              const overwriteArtist = isBySingleArtist ? newAlbum.artist : '';

              this.setState({
                selectedAlbum: newAlbum,
                overwriteArtist
              })
              this.overwriteAlbumTitleRef?.current.setValue(newAlbum.title)
              this.overwriteArtistRef?.current.setValue(overwriteArtist)
            }}
          />
        }
        <h2>Selected Album</h2>
        { selectedAlbum === null ?
          <p>There is no album selected</p> :
          <>
            <p>{selectedAlbum.title}</p>
            <p>{selectedAlbum.artist}</p>
            <h3>Metadata</h3>
            <p>
              Album Title
            </p>
            <TextBox
              placeholder="Album Title"
              defaultValue={selectedAlbum.title}
              ref={this.overwriteAlbumTitleRef}
            />
            <p>
              Artist
            </p>
            <TextBox
              placeholder="(Use Artist from Each Song)"
              onChangeValue={this.handleArtistOverrideChange}
              ref={this.overwriteArtistRef}
            />
            <p>Genre</p>
            <DropDownMenu
              onChangeValue={this.handleGenreChange}
              values={[PLEASE_SELECT, ...extraGenres, ...[...defaultGenres].sort()]}
            />
            <h3>Songs</h3>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Artist</th>
                </tr>
              </thead>
              <tbody>
                {
                  selectedAlbum.songs
                    .sort((songA, songB) => songA.trackNumber - songB.trackNumber)
                    .map((song) =>
                      <tr key={song.id}>
                        <td>{song.trackNumber}</td>
                        <td>{song.title}</td>
                        <td>{this.state.overwriteArtist || song.artist}</td>
                      </tr>
                    )
                }
              </tbody>
            </table>
          </>
        }
      </PageContainer>
    )
  }
}

const VisibleAlbumsPage = connector(AlbumsPage);
export { VisibleAlbumsPage as AlbumsPage };

