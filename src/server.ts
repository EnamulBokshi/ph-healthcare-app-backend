import app from "./app";

const bootstrap = async () => {
    try {
        app.listen(process.env.PORT || 5000, ()=> {
            console.log(`Server is running on port ${process.env.PORT || 5000}`);
        })
        
    } catch (error) {
        console.error("Error starting the server:", error);
    }
}

bootstrap();