var requestHandler = {
    url: '',
    data: {},
    header: {},
    success: function (res) {
        // success
    },
    fail: function () {
        // fail
    },
    complete: function () {

    }
}

//GET请求
function GET(requestHandler) {
    request('GET', requestHandler)
}
//POST请求
function POST(requestHandler) {
    request('POST', requestHandler)
}
//DELETE
function DELETE(requestHandler) {
    request('DELETE', requestHandler)
}
//DELETE
function PUT(requestHandler) {
    request('PUT', requestHandler)
}

function request(method, requestHandler) {
    //注意：可以对params加密等处理
    var data = requestHandler.data;
    var url = requestHandler.url;
    var header = requestHandler.header;
    wx.request({
        url: url,
        data: data,
        method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: header, // 设置请求的 header
        success: function (res) {
            //注意：可以对参数解密等处理
            requestHandler.success(res)
        },
        fail: function () {
            requestHandler.fail()
        },
        complete: function () {
            requestHandler.complete()
        }
    })
}
module.exports = {
    GET: GET,
    POST: POST,
    DELETE: DELETE,
    PUT: PUT
}