
jQuery.validator.setDefaults({
    success: 'valid'
});

$( '#RegFormItem' ).validate({
    rules: {
        'name':{
            required: true,
            minlength: 5,
            maxlength: 30
        },
        'price':{
            required: true,
            number: true
        },
        'discount_price':{
            required: false,
            number: true,
        },
        'quantity': {
            required: true,
            number: true,
        },
        'description':{
            required: true,
            minlength: 3,
            maxlength: 50
        }
    },

    messages:
    {
        'name':{
            required: "Il nome dell'oggetto è obbligatorio",
            minlength: "Scegli un nome di almeno 5 lettere",
            maxlength: "Limite di 30 caratteri superato"
            },
        'price':{
            required: "Il campo prezzo è obbligatorio",
            number: "Inserisci un numero valido"
            },
        'discount_price':{
            number: "Inserisci un numero valido",
            },
        'quantity': {
            required: "Il campo indirizzo è obbligatorio",
            minValue: "Disponibilità di almeno un oggetto",
            maxValue: "Limite massimo superato"
          },
        'description':{
            required: "Il campo citta è obbligatorio",
            minlength: "Limite minimo di 3 caratteri",
            maxlength: "Limite di 50 caratteri superato"
         }
    }
});

