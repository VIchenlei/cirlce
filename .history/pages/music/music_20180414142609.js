// pages/music/music.js
Page({
    data: {
        pauseStatus: true,
        listShow: false,
        timer: '',
        currentPosition: 0,
        duration: 0,
        poster: '',
        name: '',
        audioUrl: '',
    },
    onLoad: function (options) {
        console.log(options)
        this.setData({
            duration: options.duration,
            poster: options.poster,
            name: options.name,
            audioUrl: options.audioUrl
        })
    },
    onReady: function (e) {

    },
    bindSliderchange: function (e) {
        // clearInterval(this.data.timer)
        let value = e.detail.value
        let that = this
        console.log(e.detail.value)
        wx.getBackgroundAudioPlayerState({
            success: function (res) {
                console.log(res)
                let {
                    status,
                    duration
                } = res
                if (status === 1 || status === 0) {
                    that.setData({
                        sliderValue: value
                    })
                    wx.seekBackgroundAudio({
                        position: value * duration / 100,
                    })
                }
            }
        })
    },
    bindTapPlay: function () {
        console.log('bindTapPlay')
        console.log(this.data.pauseStatus)
        if (this.data.pauseStatus === true) {
            this.play()
            this.setData({
                pauseStatus: false
            })
        } else {
            wx.pauseBackgroundAudio()
            this.setData({
                pauseStatus: true
            })
        }
    },
    play() {
        // let {audioList, audioIndex} = this.data
        var that = this;
        wx.playBackgroundAudio({
            dataUrl: that.data.audioUrl,
            title: that.data.name,
            coverImgUrl: that.data.poster
        })
        let timer = setInterval(function () {
            that.setDuration(that)
        }, 1000)
        this.setData({
            timer: timer
        })
    },
    setDuration(that) {
        wx.getBackgroundAudioPlayerState({
            success: function (res) {
                let {
                    status,
                    duration,
                    currentPosition
                } = res
                if (status === 1 || status === 0) {
                    that.setData({
                        currentPosition: that.stotime(currentPosition),
                        duration: that.stotime(duration),
                        sliderValue: Math.floor(currentPosition * 100 / duration),
                    })
                }
            }
        })
    },
    stotime: function (s) {
        let t = '';
        if (s > -1) {
            // let hour = Math.floor(s / 3600);
            let min = Math.floor(s / 60) % 60;
            let sec = s % 60;
            // if (hour < 10) {
            //   t = '0' + hour + ":";
            // } else {
            //   t = hour + ":";
            // }

            if (min < 10) {
                t += "0";
            }
            t += min + ":";
            if (sec < 10) {
                t += "0";
            }
            t += sec;
        }
        return t;
    },
    onShareAppMessage: function () {

    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        wx.pauseBackgroundAudio()
        this.setData({
            pauseStatus: true
        })
    },

})