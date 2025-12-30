import "dotenv/config";
import mongoose from "mongoose";
import Batch from "../src/models/batches.model.js";
import Candidate from "../src/models/candidate.model.js";

console.log("Verifying Mongoose Models...");
console.log("Batch Schema Status Enum:", Batch.schema.path("status").enumValues);
console.log("Candidate Schema Status Enum:", Candidate.schema.path("status").enumValues);

if (Batch.schema.path("status").enumValues.includes("processing")) {
    console.log("✅ Batch Schema fix detected.");
} else {
    console.log("❌ Batch Schema fix NOT detected.");
}
process.exit(0);
