import { getSongsPurl, getLyric } from 'api/song'
import { isEqualSuccessCode } from 'common/js/util'
import { Base64 } from 'js-base64'

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.filename = `C400${this.mid}.m4a`
    this.url = url
  }
  // 获取歌词
  async getSongLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    const res = await getLyric(this.mid)
    if (isEqualSuccessCode(res.retcode)) {
      this.lyric = Base64.decode(res.lyric)
      return Promise.resolve(this.lyric)
    } else {
      return Promise.reject(new Error('no lyric'))
    }
  }
}

export const createSong = (musicData) => {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: _filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: musicData.url
  })
}

const _filterSinger = (singers) => {
  let singerNameArray = singers.map(singer => singer.name)
  return singerNameArray.join('/')
}

export const isPassValid = (musicData) => {
  return musicData.songid && musicData.albummid
}

export const supplementSongsPurl = async (songs) => {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  const res = await getSongsPurl(songs)
  if (isEqualSuccessCode(res.code)) {
    let midUrlInfo = res.url_mid.data.midurlinfo
    midUrlInfo.forEach((item, index) => {
      let song = songs[index]
      song.url = `https://dl.stream.qqmusic.qq.com/${item.purl}`
    })
  }
  return songs
}
