const eventService = () => {
    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/event', {
                headers: {
                    Accept: 'application/json',
                    method: 'GET',
                },
            });
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to fetch moods');
            }
        } catch (error) {
            throw error;
        }
    };

    return { fetchEvents };
};

export default eventService;
