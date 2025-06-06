
const API_BASE = "https://event-management-api-arhha6fda2aqesdj.centralus-01.azurewebsites.net/WhatsApp";

export  function SendMessageToWhatsApp(phoneNumber, message) {

    const response =  fetch(`http://localhost:3000/sendWhatsAppMessage?phone=${phoneNumber}&message=${encodeURIComponent(message)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    return Promise.resolve(response);
}


const whatsAppService = {
    SendMessageToWhatsApp
};

export default whatsAppService;