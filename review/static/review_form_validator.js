

jQuery.validator.setDefaults({
    success: 'valid'
});


$( '#RegFormReview' ).validate({
    rules: {
        'title_of_comment':{
            required: true,
            minlength: 3,
            maxlength: 50
        },
        'description':{
            required: true,
            minlength: 3,
            maxlength: 50
        }
    },

    messages:
    {
        'title_of_comment':{
            required: "Il titolo della recensione è obbligatorio",
            minlength: "Requisito minimo di almeno 3 caratteri",
            maxlength: "Limite di 50 caratteri superato"
            },
        'description':{
            required: "Il campo descrizione è obbligatorio",
            minlength: "Requisito minimo di almeno 3 caratteri",
            maxlength: "Limite di 50 caratteri superato"
            }
    }
});

