type = ['danger'];


demo = {
	showNotification: function(from, align){
    	color = Math.floor((Math.random() * 4) + 1);

    	$.notify({
        	icon: "ni ni-bell-55",
        	message: "Updated Succesfully"

        },{
            type: 'success',
            timer: 1000,
            placement: {
                from: from,
                align: align
            }
        });
	}
        showNotifications: function(from, align){
        color = Math.floor((Math.random() * 4) + 1);

        $.notify({
            icon: "ni ni-bell-55",
            message: "Couldnt connect to server, Please try again"

        },{
            type: 'danger',
            timer: 1000,
            placement: {
                from: from,
                align: align
            }
        });
    }


}
