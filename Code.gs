function doGet(e){
    //Logger.log( Utilities.jsonStringify(e) );
  if( e.parameters.v){
   // Logger.log(e.parameters.v)
    return loadPage(e.parameters["v"]);}
else
return loadPage('index');
}


function tws(){
Logger.log(getLastInvoiceDataAlternate())
}



//***************************************************************************************

function loadPage(pageName){
return HtmlService.createTemplateFromFile(pageName).evaluate(); 
}
//***************************************************************************************
function getAllInvoices(){
return getWholeSheet('Invoices');
}
//***************************************************************************************
function getAllServices(){
return getWholeSheet('Services');
}
//***************************************************************************************
function getAllServicesInOBJ(){
var data=getWholeSheet('Services');
var serviceOBJ=[];
for(var i=0; i<data.length-1; i++){
serviceOBJ.push({id:data[i][0], name:data[i][1],price:data[i][2],qty:data[i][3]})
}
return serviceOBJ;
}
//***************************************************************************************
function getAllClients(){
return getWholeSheet('Clients');

}
//***************************************************************************************
function getAllComprobantesInOBJ(){
var data=getWholeSheet('Comprobantes');
var obj=[]; 
for(var i=0; i<data.length; i++)
obj.push({id:data[i][0],number:data[i][1]})
return obj;
}
//***************************************************************************************
function getAllClientsInOBJ(){
var data=getWholeSheet('Clients');
var clientsOBJ=[]; 
for(var i=0; i<data.length; i++){
clientsOBJ.push({id:data[i][0], name:data[i][1],email:data[i][2],tel:data[i][3],dirreccion:data[i][4]})
}
Logger.log(clientsOBJ[0]);
return clientsOBJ;
}
//***************************************************************************************
function getAllUsers(){
return getWholeSheet('Users');
}
//***************************************************************************************

function getWholeSheet(shName){
var sheet= SpreadsheetApp.getActive();
var sheetName=sheet.getSheetByName(shName);
var lastRow=sheetName.getLastRow();
var lastColumn=sheetName.getLastColumn();
var data=sheetName.getRange(2,1,lastRow,lastColumn).getValues();
// Removing all fileds marked as deleted
return removeDeleted(data);
}
//***************************************************************************************
function test(){
var data= removeDeleted(getAllServices());
Logger.log(data);
}
function removeDeleted(data){
var dataToReturn=[];
var incrementor=0; 
for (var i=0; i<data.length; i++){
if(data[i][data[i].length-1] !="Deleted"){
dataToReturn[incrementor]=data[i]; 
incrementor++;
}
}
return dataToReturn;
}
//***************************************************************************************
function getWholeSheetWithIndex(shName,str,stc){
var sheet= SpreadsheetApp.getActive();
var sheetName=sheet.getSheetByName(shName);
var lastRow=sheetName.getLastRow();
var lastColumn=sheetName.getLastColumn();
return sheetName.getRange(str,stc,lastRow+1,lastColumn).getValues();
}
//***************************************************************************************
function getLastIdFromSheet(shName){
var sheet= SpreadsheetApp.getActive();
var sheetName=sheet.getSheetByName(shName);
var lastRow= sheetName.getLastRow();
var id =sheetName.getRange(lastRow, 1).getValue();
return id!=""?id:0;
} 
//***************************************************************************************
function getLastInvoiceId(shName){
return getLastIdFromSheet('Invoices');
} 
//***************************************************************************************
function getRangeById(shName,id){
var data= getWholeSheet(shName);
for(var i=0; i<data.length;i++)
  if(data[i][0]==id)
   return data[i];
}


//***************************************************************************************
function getInvoiceById(id){
return getRangeById('Invoices',id);
}

//***************************************************************************************

function getServicesById(id){
return getRangeById('Services',id);
}

//***************************************************************************************

function getClientById(id){
return getRangeById('Clients',id);
}
//***************************************************************************************
function getClientToEditById(id){
return getRangeById('ClientToEdit',id);
}
//***************************************************************************************
function getUserToEditById(id){
return getRangeById('TempUsers',id);
}
//***************************************************************************************

function getServiceToEditById(id){
return getRangeById('ServiceToEdit',id);
}
//***************************************************************************************
function invoiceData(clientID, serviceId){

var clientObj=ClientRangeToObj(getClientById(clientID));
var servicesObject= getProductListFromInvoiceRange(getInvoiceById(serviceId)); 

return{
client:clientObj,
serviceList:servicesObject
}

}
//***************************************************************************************

function invoiceDataFull(serviceId){
var invoiceRangeData=getInvoiceById(serviceId);
var clientObj=ClientRangeToObj(getClientById(invoiceRangeData[2]));
var servicesObject= getProductListFromInvoiceRange(invoiceRangeData); 

return{
client:clientObj,
serviceList:servicesObject,
type:invoiceRangeData[4]
}

}

//***************************************************************************************
function tested(){

Logger.log(getLastInvoiceDataFull());
}

function getLastInvoiceDataFull(){
var serviceId=getLastIdFromSheet('Invoices')
var invoiceRangeData=getInvoiceById(serviceId);
var clientObj=ClientRangeToObj(getClientById(invoiceRangeData[2]));
var servicesObject= getProductListOBJ(invoiceRangeData[5]); 

var date= new Date(invoiceRangeData[1])
var datestring = date.getDate()  + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
Logger.log("invoice 6 "+ invoiceRangeData[6])
var conCompro=false; if(invoiceRangeData[6]!="undefined") conCompro=true;
var comprobante={client:invoiceRangeData[7],company:invoiceRangeData[6]}
return{
client:clientObj,
serviceList:servicesObject,
type:invoiceRangeData[4],
id:invoiceRangeData[0],
date:datestring,
conComprobante:conCompro,
comprobante:comprobante
}

}

//***************************************************************************************
// Very tricky function name 
function getLastInvoiceDataAlternate(){
var serviceId=getLastIdFromSheet('TempInvoice')
var invoiceRangeData=getRangeById('TempInvoice',serviceId);
var clientObj=ClientRangeToObj(getClientById(invoiceRangeData[2]));

Logger.log("invoice 6 "+ invoiceRangeData[6])
var conCompro=false; if(invoiceRangeData[6]!="undefined") conCompro=true;
var comprobante={client:invoiceRangeData[7],company:invoiceRangeData[6]}
Logger.log("Comprobante "+conCompro)
var date= new Date(invoiceRangeData[1])
var datestring = date.getDate()  + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
Logger.log("Fecha"+datestring)
var servicesObject= getProductListOBJ(invoiceRangeData[5]); 
Logger.log("List of service is: ")
Logger.log(servicesObject)

return{
client:clientObj,
serviceList:servicesObject,
type:invoiceRangeData[4],
id:invoiceRangeData[0],
date:datestring,
conComprobante:conCompro,
comprobante:comprobante
}

}


//***************************************************************************************
function getProductListOBJ(servicesString){
 var servicesArray= servicesString.split(',');
 var Obj =[]; 
for(var i =0; i<servicesArray.length;i++){
   var serviceId= servicesArray[i].split('|')[0];
   
   var servicePrice=parseInt(servicesArray[i].split('-')[1]);
   var serviceAmount=parseInt(servicesArray[i].split('|')[1]);
   var e=servicePrice+1;
 
   Logger.log("service Amount  is : " + servicePrice+ "serviceAmount")
   var serviceRange=getServicesById(serviceId);
   Obj.push({id:serviceRange[0], name:serviceRange[1],price:servicePrice,amount:serviceAmount,unidad:serviceRange[4]})

Logger.log('The service')
Logger.log(serviceRange);
}

return Obj; 

}

//***************************************************************************************

function ClientRangeToObj(ClientRange){
 return {
 id:ClientRange[0],
 name:ClientRange[1],
 email:ClientRange[2],
 tel:ClientRange[3],
 dirr:ClientRange[4],
 }
}
//***************************************************************************************




function getProductListFromInvoiceRange(invoiceRange){
Logger.log(invoiceRange)
var invoicesRange=invoiceRange[5];
var serviceArray= invoicesRange.split(',');
var servicesObj=[]; 

for(var i=0; i<serviceArray.length; i++){
/*
Explaning....
serviceArray format: [1|200-5,2|400-5,....]
the value before the | is the product id and after is the amount and after- the price for which it was sold
*/

var serviceRange=getServicesById(serviceArray[i].split('|')[0]);//passing the service id and returning a service range
Logger.log("I:"+i +"=")
Logger.log(serviceArray[i].split('|')[0]); 
servicesObj.push({id:serviceRange[0],name:serviceRange[1],price:serviceArray[i].split('-')[1],amount:serviceArray[i].split('|')[1].substring(0,1)});//creating an obj of prod for each range
}
Logger.log("The array is "+ serviceArray[0]+ "\n The string is "+ invoicesRange);
Logger.log("The obj is "+ servicesObj[0].name);

return servicesObj;
}

//***************************************************************************************
function setService(data){
setDataToSheet('Services',data);
}
//***************************************************************************************
function setCliente(data){
 setDataToSheet('Clients', data);
}
//***************************************************************************************
function setUser(data){
 setDataToSheet('Users', data);
}

//***************************************************************************************
function setInvoice(data){
if(data.length>5){
var id = data[5].split('|')[0];
deleteDatabyId('Comprobantes',id)
}
setDataToSheet('Invoices', data);
}
//***************************************************************************************
function setComprobantes(list){

for(var i=0; i<list.length; i++){
var data=[];
data[0]=list[i]
setDataToSheet('Comprobantes', data)
}
}
//***************************************************************************************
function setDataToSheet(shName, data){
  
  var sheet= SpreadsheetApp.getActive();
  var sheetName=sheet.getSheetByName(shName);
  var last_row=sheetName.getLastRow();
  var last_col=sheetName.getLastColumn();
 // Adding the id now: 
 var newId=getLastIdFromSheet(shName)+1; 
 data.unshift(newId);
  for(var _columna=1 ; _columna <last_col+1; _columna++){
    sheetName.getRange(last_row + 1, _columna).setValue(data[_columna-1]);
    Logger.log("In coloumn" + _columna + "set" +data[_columna-1]);}
 }

//************************************************************************************************

function signInUser (){
var users=getAllUsers();
var email=signInEmail(); 
for(var i=0; i<users.length; i++){
if(users[i][0]==email)
return users[i];
}   
return "Unknown user";  

}
//******************************************************************************************

function signInEmail(){
return Session.getActiveUser().getEmail();
}

//******************************************************************************************
function include(filename){
/* This Function include an HTML page to another one*/
return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

//***************************************************************

function setDataToEdit(id, shName,editSh){
var data = getRangeById(shName,id);
// Save data to access later. 
var sheet= SpreadsheetApp.getActive();
var sheetName=sheet.getSheetByName(editSh);
var last_row=sheetName.getLastRow();
var last_col=sheetName.getLastColumn();

for(var _columna=1 ; _columna <last_col+1; _columna++){
sheetName.getRange(last_row + 1, _columna).setValue(data[_columna-1]);
Logger.log("In coloumn" + _columna + "set" +data[_columna-1]);}

}
//***************************************************************
function setInvoiceToEdit(id){
setDataToEdit(id, 'Invoices','TempInvoice'); 
}
//***************************************************************
function setUserToEdit(id){
setDataToEdit(id, 'Users','TempUsers'); 
}
//***************************************************************


function setServiceToedit(id){
setDataToEdit(id, 'Services','ServiceToEdit'); 
}
//***************************************************************
function setClientToedit(id){
var data = getClientById(id); 
// Save data to access later. 
var sheet= SpreadsheetApp.getActive();
var sheetName=sheet.getSheetByName('ClientToEdit');
var last_row=sheetName.getLastRow();
var last_col=sheetName.getLastColumn();


for(var _columna=1 ; _columna <last_col+1; _columna++){
sheetName.getRange(last_row + 1, _columna).setValue(data[_columna-1]);
Logger.log("In coloumn" + _columna + "set" +data[_columna-1]);}

}
//***************************************************************

function getClientToedit(){
return getClientToEditById(getLastIdFromSheet('ClientToEdit')); 
}
//***************************************************************

function getUserToedit(){
return getUserToEditById(getLastIdFromSheet('TempUsers')); 
}
//***************************************************************
function getServiceToedit(){
return getServiceToEditById(getLastIdFromSheet('ServiceToEdit')); 
}

//***************************************************************

function editDataById(shName, data){
var sheet= SpreadsheetApp.getActive();
var sheetName=sheet.getSheetByName(shName);
  var last_col=sheetName.getLastColumn();
  var row=parseInt(data[0]);

  for(var _columna=1 ; _columna <last_col+1; _columna++){
    sheetName.getRange(row + 1, _columna).setValue(data[_columna-1]);
    Logger.log("In coloumn" + _columna + "set" +data[_columna-1]);}
}
//***************************************************************
function testing(){
deleteServiceByid(7); 
}
//***************************************************************
function deleteDatabyId(shName, id){

var sheet= SpreadsheetApp.getActive();
var sheetName=sheet.getSheetByName(shName);
var last_col=sheetName.getLastColumn();
var row=parseInt(id);
sheetName.getRange(row+1, last_col).setValue("Deleted");

}
//***************************************************************
function deleteClientByid(id){
deleteDatabyId('Clients', id); 
}
//***************************************************************
function deleteUserByid(id){
deleteDatabyId('Users', id); 
}
//***************************************************************
function deleteServiceByid(id){
deleteDatabyId('Services', id); 
}
//***************************************************************
function editClientByid(data){
editDataById('Clients', data); 
}
//***************************************************************
function editUserByid(data){
editDataById('Users', data); 
}
//***************************************************************
function editServiceByid(data){
editDataById('Services', data); 
}
//***************************************************************
function setUserToEdit(id){
setDataToEdit(id, 'Users','TempUsers'); 
}


