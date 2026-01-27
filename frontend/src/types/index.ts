export interface Job {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
    // Add other fields as per backend (e.g. status, etc)
}

export interface Batch {
    _id: string;
    jobId: string;
    source: 'local' | 'gdrive';
    limit: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdAt: string;
}

// Candidate type with all properties
export interface Candidate {
    _id: string;
    batchId: string;
    name: string;
    email?: string;
    score: number;
    status: string;
    summary: string;
    rank?: number;
    resumeUrl?: string;
    // Additional optional fields
    phone?: string;
    location?: string;
}
