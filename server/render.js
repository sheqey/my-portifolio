
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const student = require("../models/studentsmodel")
const info = require("../models/infotable")
const user = require("../models/user")
const amenities = require("../models/amenitymodel")
const contact = require("../models/contactmodel")
const serv = require("../models/servicesof")
const { sendMoney } = require('../models/mpesa');
const dep = require("../models/dept")
const doc = require("../models/docs")
const appoint = require("../models/aponiments")
const Transaction = require("../models/transactions")
const  { extractText }= require('../models/nhif2');
const axios = require('axios')
const { response } = require("express");
const { Console } = require("console");
const { start } = require("repl");
//const { data } = require("cheerio/lib/api/attributes")




//creat for backend

exports.combined = (req,res)=>{
    if (req.session.uid) {
        
    } else {
     
      res.redirect("/login")
    }
    amenities.aggregate([

        {$lookup:{ from: 'info_tables', localField:'abcode', 
          foreignField:'abcode',as:'data'}},
  ]).exec((err, result)=>{
        if (err) {
            console.log("error" ,err)
        }
        if (result) {
      
            res.render("combined",{result:result})
        }
  });

} 
//

exports.combinedview = (req,res)=>{
    if (req.session.uid) {
        
    } else {
     
      res.redirect("/login")
    }
    amenities.aggregate([

        {$lookup:{ from: 'info_tables', localField:'abcode', 
          foreignField:'abcode',as:'data'}},
  ]).exec((err, result)=>{
        if (err) {
            console.log("error" ,err)
        }
        if (result) {
      
            res.render("combinedview",{result:result})
        }
  });

} 

//

exports.cdeleteroute = (req,res)=>{

    res.render("combineddelete");
}

exports.capideleteroute = (req,res)=>{

    var id = req.query.id
    amenities.findByIdAndDelete(id)
            .then(data =>{
                
                //console.log(data)
                res.render("update",{data:data});
            })
       
            res.redirect("../combinedview")

}


////////////////////////////////////////////////////////////////////////////////
exports.pu = (req, res) => {
  var id = req.query.id;

  appoint.findByIdAndUpdate(id, req.body)
    .then(
      data => {
        if (!data) {
          return res.status(500).send({ message: `Sorry, we can't find a movie with an ID of ${id}` });
        } else {
          res.redirect("/checkapps");
        }
      }
    )
    .catch(err => {
      res.status(500).send({ message: err.message || "Well, aren't you damned 😂" });
    });
};


////////////////////////////////////////////////////////////
//apiupdateroute
exports.capiupdateroute = (req,res)=>{
    var id = req.params.id
    
    amenities.findByIdAndUpdate(id,req.body)
    .then(
        data=>{
            if(!data){
       
         res.status(500).send({message:err.message|| `sorry we cant find movie with id of ${id}`})
            }else{
               
            }
        }
    ).catch(err =>{
        res.status(500).send({message:err.message|| "well arent you damned🤣"})
    })
    
    
    res.redirect("/combinedview")
    }
            
    exports.cupdateroute = (req,res)=>{
        var id = req.query.id
    amenities.findById(id)
            .then(data =>{
                //console.log(data)
                res.render("combinedupdate",{data:data});
            })
       
    }

/////////////////////////////////adminlogin//////////////////////////////////////////////////


exports.palogin = async (req, res) => {
  console.log("hit login page1");
  console.log(req.body);

  // Find a user with the matching email
  amenities.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      // If there is an error, send a 500 status code
      console.log("errrr not found");
      return res.status(500).send();
    }

    if (!user) {
      // If there is no user with the matching email, send a 401 status code
      console.log("not found");
      return res.redirect("/admin");
    }

    if (user) {
      if (user.password === req.body.password) {
        console.log("The strings are equal");
        req.session.hid = user.abcode;
        return res.redirect(`/adminp?id=${req.session.hid}`);
      } else {
        console.log("The strings are not equal");
        console.log(user);
        return res.redirect("/admin");
      }
    }
  });
};




////////////////////post login//////////////////////////////////////////////////////////////
exports.plogin = async (req,res)=>{
   console.log("hit login page1")
   console.log(req.body)
      // Find a user with the matching email
  user.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      // If there is an error, send a 500 status code
      console.log("errrr not found")
    }

    if (!user) {
      // If there is no user with the matching email, send a 401 status code
      console.log("not found")
      res.redirect("/login")
    }
    if(user){
        if (user.password === req.body.password) {
            console.log('The strings are equal');
            req.session.uid = user.uid
            res.redirect("/")
          } else {
            console.log('The strings are not equal');
            console.log(user)
            res.redirect("/login")
          }
    }
  
    // Compare the provided password with the hashed password in the database
   
  });

   
  };

////////////////post book////////////////////////////////////////////////////////////////////////////////////////


exports.apibook = async (req,res)=>{
   
    req.session.abcode = req.query.id;
    req.session.pcode = '004';
    req.session.pname = req.body.pname;
    req.session.pemail = req.body.pemail;
    req.session.pdate = req.body.pdate;
    req.session.dep = req.body.dep;
    req.session.pphone = req.body.pphone;
  
    
    res.redirect(`../mpesa?id=${req.query.id}`)
   
  };

///////////////////////////admin home///////////////////////////
exports.adminpage = async (req,res)=>{
  const hosid = req.session.hid
  
    
     const data = await info.findOne({abcode:hosid});
    
     const data2 = await amenities.findOne({abcode:hosid});
     const data3 = await contact.findOne({abcode:hosid});
     const data4 = await serv.find({abcode:hosid});
     const data5 = await dep.find({abcode:hosid});
     const data6 = await doc.find({abcode:hosid});

     
     req.session.user = {
      email: data2.email,
      name: "John Doe"
    };
      // Render the creatbiz view and pass in the text as a variable
      res.render("adminindex",{data:data,data2:data2,data3:data3,data4:data4,data5:data5,data6:data6,user:req.session.user });
   
  
  }



///////////////////////////////////////////////MPESA/////////////////////////////////////


exports.mpesa = async (req,res)=>{
    const hosid = req.query.id
    
       const num = req.body.idnum;
       const data = await info.findOne({abcode:hosid});
       const data2 = await amenities.findOne({abcode:hosid});
       const data3 = await contact.findOne({abcode:hosid});
       const data4 = await serv.find({abcode:hosid});
       const data5 = await dep.find({abcode:hosid});
       const data6 = await doc.find({abcode:hosid});
       extractText(num)
      .then(text => {
        console.log(text)
        // Render the creatbiz view and pass in the text as a variable
        res.render("mpesa",{ text:text,data:data,data2:data2,data3:data3,data4:data4,data5:data5,data6:data6 });
      })
      .catch(error => {
        console.error(error);
      });
    
    }
////////////////////////////////////////MPESA PAYMENT///////////////////////////////////////

exports.sendmoney = async (req,res)=>{
    const hosid = req.query.id
       const num = req.body.num;
       req.session.num = num
       sendMoney(req.body.num,"transacctiondescription")
      .then(text => {
        
        // Render the creatbiz view and pass in the text as a variable
        res.redirect(`transactions?id=${hosid}`);
      })
      .catch(error => {
        console.error(error);
      });
    
    }
/////////////////////////////////////////////set//////////////////////////////////////

exports.set = async (req,res)=>{
  var hosid = req.session.hid;
  const data = await info.findOne({abcode:hosid});
  const data2 = await amenities.findOne({abcode:hosid});
  const data3 = await contact.findOne({abcode:hosid});
  const data4 = await serv.find({abcode:hosid});
  const data5 = await dep.find({abcode:hosid});
  const data6 = await doc.find({abcode:hosid});
  const apps = await appoint.findById(req.query.id);
//console.log(apps)
  req.session.user = {
    email: req.session.hid,
    name: "John Doe"
  };
  
 


   
  res.render("set",{data:data,data2:data2,data3:data3,data4:data4,data5:data5,data6:data6,apps:apps,user:req.session.user});

  
};
/////////////////////////////////////////POST NHIF////////////////////////////////////////////////

///////////////////////////////////////////movies///////////////////////////////////
exports.movies = async(req,res)=>{
  const coming = await axios.get("https://api.kenyabuzz.com/getMainMenu")
  const cs = coming.data.data.movies.coming_soon
  b = coming.data.data.movies.bollywood
  c = coming.data.data.movies.cinema_list
  const movies = await axios.get("https://api.kenyabuzz.com/mvsHot")
  const movie = movies.data.data
 // console.log(movie)
  const response = await axios.get("https://api.kenyabuzz.com/mvDetailsBySlg/whitney-houston-i-wanna-dance-with-somebody");
  const movies2 = response.data
 // console.log(movies2.api_data); 
  res.render("movies",{movie:movie,coming:cs,hindi:b,cinema:c})
}
//////////////////////////////////////movie/////////////////////////////////////////////
exports.movie= async(req,res)=>{
  const coming = await axios.get(`https://api.kenyabuzz.com/mvDetailsBySlg/${req.query.id}`)
  const c = coming.data.data
  let cast = c.cast_data.cast;
  let crew = c.cast_data.crew;
 // console.log(c)

   
  res.render("movie",{movie:c,cast:cast,crew:crew})
}


////////////////////////////////////////////////////////////////////////////////////

exports.checknhif = async (req,res)=>{
const hosid = req.query.id
   const num = req.body.idnum;
   const data = await info.findOne({abcode:hosid});
   const data2 = await amenities.findOne({abcode:hosid});
   const data3 = await contact.findOne({abcode:hosid});
   const data4 = await serv.find({abcode:hosid});
   const data5 = await dep.find({abcode:hosid});
   const data6 = await doc.find({abcode:hosid});
   extractText(num)
  .then(text => {
    console.log(text)
    // Render the creatbiz view and pass in the text as a variable
    res.render("covered",{ text:text,data:data,data2:data2,data3:data3,data4:data4,data5:data5,data6:data6 });
  })
  .catch(error => {
    console.error(error);
  });

}
/////////////////////////////////////NHIF VIEW///////////////////////////////////////////////////////////////////////
exports.nhif = async (req,res)=>{
    var hosid = req.query.id;
    const data = await info.findOne({abcode:hosid});
    const data2 = await amenities.findOne({abcode:hosid});
    const data3 = await contact.findOne({abcode:hosid});
    const data4 = await serv.find({abcode:hosid});
    const data5 = await dep.find({abcode:hosid});
    const data6 = await doc.find({abcode:hosid});


    res.render("nhif",{data:data,data2:data2,data3:data3,data4:data4,data5:data5,data6:data6});

}
//////////////////check appont///////////////////////////////////////////////////////////////////////////////////////////////
exports.getapp = async (req,res)=>{
  var hosid = req.query.id;
  const data = await info.findOne({abcode:hosid});
  const data2 = await amenities.findOne({abcode:hosid});
  const data3 = await contact.findOne({abcode:hosid});
  const data4 = await serv.find({abcode:hosid});
  const data5 = await dep.find({abcode:hosid});
  const data6 = await doc.find({abcode:hosid});
  const apps = await appoint.find({pcode:req.session.uid});


  
 console.log(apps)


   
  res.render("apps",{data:data,data2:data2,data3:data3,data4:data4,data5:data5,data6:data6,apps:apps});

  
};
//////////////////book///////////////////////////////////////////////////////////////////////////////////////////////
exports.getbook = async (req,res)=>{
    var hosid = req.query.id;
    const data = await info.findOne({abcode:hosid});
    const data2 = await amenities.findOne({abcode:hosid});
    const data3 = await contact.findOne({abcode:hosid});
    const data4 = await serv.find({abcode:hosid});
    const data5 = await dep.find({abcode:hosid});
    const data6 = await doc.find({abcode:hosid});

   // console.log(data6)

     
    res.render("book",{data:data,data2:data2,data3:data3,data4:data4,data5:data5,data6:data6});

    
  };
////////////////////get appsa/////////////////////////////////////////////////////////////////////////


exports.getapps = async (req,res)=>{
  var hosid = req.session.hid;
  const data = await info.findOne({abcode:hosid});
  const data2 = await amenities.findOne({abcode:hosid});
  const data3 = await contact.findOne({abcode:hosid});
  const data4 = await serv.find({abcode:hosid});
  const data5 = await dep.find({abcode:hosid});
  const data6 = await doc.find({abcode:hosid});
  const apps = await appoint.find({abcode:req.session.hid});

  req.session.user = {
    email: req.session.hid,
    name: "John Doe"
  };
  
 console.log(apps)


   
  res.render("gapps",{data:data,data2:data2,data3:data3,data4:data4,data5:data5,data6:data6,apps:apps,user:req.session.user});

  
};
////////////////get hospital/////////////////////////////////////////////////////////////////////////////



exports.gethos = async (req,res)=>{
    var hosid = req.query.id;
    const data = await info.findOne({abcode:hosid});
    const data2 = await amenities.findOne({abcode:hosid});
    const data3 = await contact.findOne({abcode:hosid});
    const data4 = await serv.find({abcode:hosid});
    const data5 = await dep.find({abcode:hosid});
    const data6 = await doc.find({abcode:hosid});



     
    res.render("hospital",{data:data,data2:data2,data3:data3,data4:data4,data5:data5,data6:data6});

    
  };
/////////////////////////////////login page//////////////////////////////////////////////////
exports.login = async(req,res)=>{
    var hosid = "502";
    const data = await info.findOne({abcode:hosid});
    const data2 = await amenities.findOne({abcode:hosid});
    const data3 = await contact.findOne({abcode:hosid});
    const data4 = await serv.find({abcode:hosid});
    const data5 = await dep.find({abcode:hosid});
    const data6 = await doc.find({abcode:hosid});

   

     
    res.render("login",{data:data,data2:data2,data3:data3,data4:data4,data5:data5,data6:data6});

}
//////////////////////////////admin login///////////////////////

exports.adlogin = async(req,res)=>{
  var hosid = "502";
  const data = await info.findOne({abcode:hosid});
  const data2 = await amenities.findOne({abcode:hosid});
  const data3 = await contact.findOne({abcode:hosid});
  const data4 = await serv.find({abcode:hosid});
  const data5 = await dep.find({abcode:hosid});
  const data6 = await doc.find({abcode:hosid});

 

   
  res.render("adminlogin",{data:data,data2:data2,data3:data3,data4:data4,data5:data5,data6:data6});

}

///////////////////////////////////////////////////////////
exports.reg = async(req,res)=>{
    var hosid = "502";
    const data = await info.findOne({abcode:hosid});
    const data2 = await amenities.findOne({abcode:hosid});
    const data3 = await contact.findOne({abcode:hosid});
    const data4 = await serv.find({abcode:hosid});
    const data5 = await dep.find({abcode:hosid});
    const data6 = await doc.find({abcode:hosid});

  

     
    res.render("regestration",{data:data,data2:data2,data3:data3,data4:data4,data5:data5,data6:data6});

}
////////////////////////////////////////////////TRANSACTIONS////////////////////////////////

exports.transactions = async (req,res)=>{
   
    const hosid = req.query.id
    console.log('above waiting...');
    const currentDate = new Date();
    const obj = {
        abcode: req.session.abcode,
        pcode: req.session.uid,
        pname: req.session.pname,
        pemail: req.session.pemail,
        pdate: currentDate.toDateString(),
        dep: req.session.dep,
        pphone: req.session.pphone
      };

    const data = await info.findOne({abcode:hosid});
    const data2 = await amenities.findOne({abcode:hosid});
    const data3 = await contact.findOne({abcode:hosid});
    const data4 = await serv.find({abcode:hosid});
    const data5 = await dep.find({abcode:hosid});
    const data6 = await doc.find({abcode:hosid});
      setTimeout(() =>{
        Transaction.findOne({resultCode: '0', phoneNumber: req.session.num})
  .then(ret => {
           
if (ret) {
    console.log(ret) 
  console.log("now saving new appointment........")
    const newapp = new appoint({
    
        abcode:req.query.id,
        pcode:req.session.uid,
        pname:obj.pname,
        pemail:obj.pemail,
        pdate:obj.pdate,
        dep:obj.dep,
        pphone:obj.pphone
    
    })
    newapp
    .save(newapp)
    .then(data =>{
    
        console.log(data)
    })
}else{
    console.log("your data was not saved!")
}
  });

        


          console.log('inside wait for 2 seconds...');
}, 15000);
console.log('outside Waited for 2 seconds...');
    res.render("transaction",{data:data,data2:data2,data3:data3,data4:data4,data5:data5,data6:data6,obj:obj,sesn:req.session.uid})
}

//////////////////////CALLBACKURL SAVA DATA /////////////////////////////////////////////////



exports.callbackurl = (req,res) => {
   
console.log("hitting callbackurl..........")

    if (req.body.Body.stkCallback.ResultCode.toString() === "0") {
        // Save the transaction with the values from the Item array
        const newTransaction = new Transaction({
          merchantRequestID: req.body.Body.stkCallback.MerchantRequestID,
          checkoutRequestID: req.body.Body.stkCallback.CheckoutRequestID,
          resultCode: req.body.Body.stkCallback.ResultCode,
          resultDesc: req.body.Body.stkCallback.ResultDesc,
          amount: req.body.Body.stkCallback.CallbackMetadata.Item[0].Value,
          mpesaReceiptNumber: req.body.Body.stkCallback.CallbackMetadata.Item[1].Value,
          transactionDate: req.body.Body.stkCallback.CallbackMetadata.Item[3].Value,
          phoneNumber: req.body.Body.stkCallback.CallbackMetadata.Item[4].Value
        });
        newTransaction.save(newTransaction).then(data => {
          console.log(data);
        });
      } else {
        // Save the transaction without the values from the Item array
        const newTransaction = new Transaction({
          merchantRequestID: req.body.Body.stkCallback.MerchantRequestID,
          checkoutRequestID: req.body.Body.stkCallback.CheckoutRequestID,
          resultCode: req.body.Body.stkCallback.ResultCode,
          resultDesc: req.body.Body.stkCallback.ResultDesc
        });
        newTransaction.save(newTransaction).then(data => {
          console.log(data);
        });
      }
      
      
        
      
    res.sendStatus(200);
  }
  
  
//////////////////////////////////////////////////////////////////////////////////////////

exports.creatbiziroute = (req,res)=>{

      
    res.render("creatbiz")  
}   

exports.getamenity = (req,res)=>{

      
    res.render("newamenity")  
}  
        //apicreatbiziroute
exports.apicreatbiziroute = (req,res)=>{


console.log(req.body)
console.log(req.body.abcode)
const newinfo = new info({

    abcode:req.body.abcode,
    comments:req.body.comments,
    ratings:req.body.ratings,
    image:req.body.image



})

newinfo
.save(newinfo)
.then(data =>{

    //console.log(data)
})

res.redirect("../newamenity")
}

exports.apicreatnewbiz = (req,res)=>{


    console.log(req.body)
    console.log(req.body.abcode)
    const newaminity = new amenities({
        password:req.body.password,
        email:req.body.email,
        abcode:req.body.abcode,
        atcode:req.body.atcode,
        alonglat:req.body.alonglat,
        aimage:req.body.aimage,
        aname:req.body.aname,
        adesc:req.body.adesc,
      
    })
    
    newaminity
    .save(newaminity)
    .then(data =>{
    
      
    })
    
    res.redirect("../creatbiz")
    }
    
    









exports.indexrout = async (req,res)=>{
    if (req.session.uid) {
        
    } else {
     
      res.redirect("/login")
    }

    const data = await serv.find();

    amenities.aggregate([

        {$lookup:{ from: 'info_tables', localField:'abcode', 
          foreignField:'abcode',as:'data'}},
  ]).exec((err, result)=>{
        if (err) {
            console.log("error" ,err)
        }
        if (result) {
      
            res.render("combined",{result:result,data:data})
        }
  });
   
}

exports.readroute = (req,res)=>{

    student.find()
            .then(sdata =>{
              
                res.render("read",{data:sdata});
            })
    
}


exports.creatroute = (req,res)=>{

      
            res.render("creat")  
}

exports.apicreatroute = (req,res)=>{


console.log(req)
const newstudent = new student({

    name:req.body.name,
    age:req.body.age,
    major:req.body.major


})

newstudent
     .save(newstudent)
     .then(data =>{
        
        
     })
   
     res.redirect("../read")
}

exports.apiupdateroute = (req,res)=>{
    if (req.session.uid) {
        
      } else {
       
        res.redirect("/login")
      }
var id = req.params.id

student.findByIdAndUpdate(id,req.body)
.then(
    data=>{
        if(!data){
   
     res.status(500).send({message:err.message|| `sorry we cant find movie with id of ${id}`})
        }else{
           
        }
    }
).catch(err =>{
    res.status(500).send({message:err.message|| "well arent you damned🤣"})
})


res.redirect("/read")
}

exports.updateroute = (req,res)=>{
    var id = req.query.id
student.findById(id)
        .then(data =>{
            //console.log(data)
            res.render("update",{data:data});
        })
   
}

exports.deleteroute = (req,res)=>{

    res.render("delete");
}

exports.apideleteroute = (req,res)=>{

    var id = req.query.id
    student.findByIdAndDelete(id)
            .then(data =>{
                
                //console.log(data)
                res.render("update",{data:data});
            })
       
            res.redirect("../read")

}





//api for creating

exports.apicreate =(req, res)=>{

    axios.post('http://localhost:5054/api/creat',{
        name:  req.body.name,
        age:   req.body.age,
        major: req.body.major

           }
      )
      .then(function (response) {
        res.send(response);
      })





}

///////////////////add contact info/////////////////////////

exports.apiccreatroute = (req,res)=>{


    console.log(req)
    const newcontact = new contact({
    
        abcode:req.body.abcode,
        adress:req.body.adress,
        website:req.body.website,
        contact:req.body.contact,
        email:req.body.email,
    
    
    })
    
    newcontact
         .save(newcontact)
         .then(data =>{
     
         })
       
         res.redirect("../combinedview")
    }

/////////////////add user///////////////////////////////////////////////////////////////////////
exports.regester =(req,res)=>{
    console.log(req.body)
    console.log(req.file.originalname)
    const newuser = new user({
     
        email:req.body.email,
        password:req.body.password,
        uid:req.body.email, 
        image:req.file.originalname
       
    
    })
    
    newuser
         .save(newuser)
         .then(data =>{ 
     console.log(data)
         })
       
         res.redirect("../login")
    }
/////////////add new docter///////////////////////////////////////////////////////////////////////////



exports.addoc =(req,res)=>{

    const newdoc = new doc({
    
        abcode:req.body.abcode,
        docname:req.body.docname,
        docdep:req.body.docdep,
        docdesc:req.body.docdesc,
        docimage:req.file.originalname
       
    
    })
    
    newdoc
         .save(newdoc)
         .then(data =>{ 
     
         })
       
         res.redirect("../combinedview")
    }
    
/////////////////creatnew department///////////////////////////////
       
exports.apidccreatroute = (req,res)=>{


   


    const newdep = new dep({
    
        abcode:req.body.abcode,
        ddesc:req.body.ddesc,
        depname:req.body.depname,
        depcont:req.body.depcont,
        depimage:req.body.depimage
       
    
    
    })
    
    newdep
         .save(newdep)
         .then(data =>{
     
         })
       
         res.redirect("../combinedview")
    }


  ///////////////////add service/////////////// /////////////////////////// 


  exports.apisccreatroute = (req,res)=>{
    //console.log(req)
    const newserv = new serv({
    
        abcode:req.body.abcode,
        sname:req.body.sname,
        sdesc:req.body.sdesc
      
       
    
    
    })
    
    newserv
         .save(newserv)
         .then(data =>{ 
     
         })
       
         res.redirect("../combinedview")
    }
    





///////////////////view pages//////////////////////////////////////////////////////////////
    exports.getcontact = (req,res)=>{

        res.render("addcontact")
    }
    exports.getservice = (req,res)=>{

        res.render("addservice")
    }
    exports.getdep = (req,res)=>{

        res.render("addep")
    }

    exports.getdocs = (req,res)=>{

        res.render("addocs")
    }


  
   
  
















/////////constant functions/////////


    
    
  






