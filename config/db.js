const { default: mongoose } = require("mongoose")

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGODBCONNECT_URL,{ useNewUrlParser: true, useUnifiedTopology: true })
        if(conn){
            conn.then((data)=>{
                // console.log(data,"Databese Successfully Connected!")
                
                console.log("Database Successfully Connected!")

            })
        }
        else{
            console.log("Something Went wrong")
        }

    } catch (error) {
        console.log("Database Connection Failed!")
    }
}

module.exports = dbConnect;