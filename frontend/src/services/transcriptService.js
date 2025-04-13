import api from "./api";

const transcriptService = {
    extractTranscript: async (youtubeUrl) => {
        try {
            const response = await api.post("/api/transcript/extract", {
                youtube_url: youtubeUrl,
            });
            return response.data;
        } catch (error) {
            console.error("Error extracting transcript:", error);
            throw error;
        }
    },

    rewriteTranscript: async (transcriptId, options = {}) => {
        try {
            const { tone = "professional", clarity_level = 1 } = options;
            const response = await api.post("/api/transcript/rewrite", {
                transcript_id: transcriptId,
                tone,
                clarity_level,
            });
            return response.data;
        } catch (error) {
            console.error("Error rewriting transcript:", error);
            throw error;
        }
    },

    generateSummary: async (transcriptId, length = "medium") => {
        try {
            const response = await api.post("/api/transcript/summary", {
                transcript_id: transcriptId,
                length,
            });
            return response.data;
        } catch (error) {
            console.error("Error generating summary:", error);
            throw error;
        }
    },

    getTranscript: async (transcriptId) => {
        try {
            const response = await api.get(`/api/transcript/${transcriptId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching transcript:", error);
            throw error;
        }
    },

    listTranscripts: async (skip = 0, limit = 10) => {
        try {
            const response = await api.get("/api/transcript/list", {
                params: { skip, limit },
            });
            return response.data;
        } catch (error) {
            console.error("Error listing transcripts:", error);
            throw error;
        }
    },

    deleteTranscript: async (transcriptId) => {
        try {
            const response = await api.delete(
                `/api/transcript/${transcriptId}`
            );
            return response.data;
        } catch (error) {
            console.error("Error deleting transcript:", error);
            throw error;
        }
    },
};

export default transcriptService;
