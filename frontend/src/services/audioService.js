import api from "./api";

const audioService = {
    generateAudio: async (transcriptId, options = {}) => {
        try {
            const { textType = "original", voiceModel = "default" } = options;
            const response = await api.post("/api/audio/generate", {
                transcript_id: transcriptId,
                text_type: textType,
                voice_model: voiceModel,
            });
            return response.data;
        } catch (error) {
            console.error("Error generating audio:", error);
            throw error;
        }
    },

    getAudio: async (audioId) => {
        try {
            const response = await api.get(`/api/audio/${audioId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching audio:", error);
            throw error;
        }
    },

    getVoices: async () => {
        try {
            const response = await api.get("/api/audio/voices");
            return response.data;
        } catch (error) {
            console.error("Error fetching available voices:", error);
            throw error;
        }
    },

    deleteAudio: async (audioId) => {
        try {
            const response = await api.delete(`/api/audio/${audioId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting audio:", error);
            throw error;
        }
    },

    downloadAudio: async (audioId) => {
        try {
            const response = await api.get(`/api/download/audio/${audioId}`, {
                responseType: "blob",
            });
            return response.data;
        } catch (error) {
            console.error("Error downloading audio:", error);
            throw error;
        }
    },
};

export default audioService;
