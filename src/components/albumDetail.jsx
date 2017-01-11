import React, { Component }  from 'react';
import { getalbum } from '../redux/action/fetch';
import { notification } from 'antd';
import SongListRow from './songListRow';
import SongListHeader from './songListHeader';

const styles = {
  title: {
    
  },
  headArea: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
  },
  albumInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingLeft: '30px',
  },
  titleText: {
    color: '#333',
    marginBottom: '20px',
    fontSize: '30px',
  },
  description: {
    color: '#888',
    marginTop: '10px',
    fontSize: '16px',
  },
  list: {
    margin: '30px 0',
  }
};

const vendorConvert = {
  xiami: '虾米',
  qq: 'QQ音乐',
  netease: '网易云音乐',
};

class AlbumDetail extends Component{
  constructor(props){
    super(props);
    this.state = {
      id: this.props.params.id,
      vendor: this.props.params.vendor,
      loaded: false,
      data: null,
    };
  }
  componentDidMount(){
    if(this.state.vendor && this.state.id){
      getalbum(this.state.vendor, this.state.id)
        .then(res => {
          if(res.success){
            console.log(res);
            this.setState({
              loaded: true,
              data: res
            });
          } else {
            throw new Error(res.message);
          }
        })
        .catch(e => {
          notification.error({
            message: '出错啦',
            description: e
          });
        });
    } else {
      notification.error({
        message: '出错啦',
        description: '路由错误，请检查URL地址'
      });
    }
  }
  render(){
    if(this.state.loaded){
      const { data, vendor } = this.state;
      const songlist = data.songList.map((item, index) => {
        return(
          <SongListRow
            key={index}
            index={index}
            name={item.name}
            artist={item.artists.map(i => i.name).join(' & ')}
            album={data.name}
            id={item.id}
            vendor={vendor}
            data={item}
          />
        );
      });
      return(
        <div style={{margin: '40px 20px 20px 20px'}}>
          <div style={styles.title}></div>
          <div style={styles.headArea}>
            <img src={data.cover} alt={`${data.name}`} height={250} width={250} />
            <div style={styles.albumInfo}>
              <h1 style={styles.titleText}>{data.name}</h1>
              <h2 style={styles.description}>{`音乐人: ${data.artist.name}`}</h2>
              <h2 style={styles.description}>{`曲目数: ${data.songList.length}首`}</h2>
            </div>
          </div>
          <div style={styles.list}>
            <SongListHeader />
            {songlist}
          </div>
        </div>
      )
    }
    return(
      <div />
    );
  }
}

export default AlbumDetail;