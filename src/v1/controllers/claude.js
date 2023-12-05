
const parsePDF = (path) => {

}

module.exports.startConvo = async (req, res) => {
    try {
        const { Claude } = await import('claude-ai');
        const { pdfFile } = req.body
        parsePDF(pdfFile)
        const claude = new Claude({
            sessionKey: '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',
            fetch: globalThis.fetch
        });
        do{
            await claude.init();
        }while(!claude.ready)
        console.log(claude);    
        
        const conversation = await claude.startConversation("Hello World");
        console.log("---------------------------------------------");
        console.log(conversation);
        await conversation.sendMessage('How are you today?');
        res.status(200).send('Successfully started the conversation');
    } catch (e) {
        console.log(e);
        res.status(500).send('Error occured while starting the conversation');
    }
}
