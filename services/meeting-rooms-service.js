
export const meetingRooms = await fetch('../../resources/meeting-rooms.json')
.then(response => response.json())
.then(data => {
    return data;
})
.catch(error => console.error('Error reading JSON file:', error));