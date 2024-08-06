class ApiResponse{
    constructor(statusCode,data,message="success"){
        this.message=message
        this.success=true
        this.data=data
    }
}
module.exports= {ApiResponse}