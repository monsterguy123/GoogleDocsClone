import mongoose from 'mongoose';

export default async () => {
    const dbConnectionString = process.env.DB || "";

    try {
        await mongoose.connect(dbConnectionString);
        console.log(`connected to the db successfully...`)
    } catch (error) {
        console.log(error)
    }
}
