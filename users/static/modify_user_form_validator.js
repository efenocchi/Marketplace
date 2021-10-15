$.validator.methods.email = function( value, element ) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return this.optional( element ) || emailReg.test( value );
};

jQuery.validator.setDefaults({
    success: 'valid'
});

jQuery.validator.addMethod("lettersonly", function(value, element) {
    return this.optional(element) || /^[a-z\s]+$/i.test(value);
}, "Caratteri numerici non ammessi");

jQuery.validator.addMethod("specialcharacter", function(value, element) {
    return /^[0-9A-Za-z]*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?][0-9a-zA-Z]*$/.test(value);
}, "Inserire almeno un carattere speciale");

$( '#RegFormUser2' ).validate({
    rules: {
        'username':{
            required: true,
            minlength: 3,
            maxlength: 30
        },
        'email':{
            required: true,
            email: true,
            minlength: 5,
            maxlength: 50
        },
        'password':{
            required: true,
            minlength: 8,
            maxlength: 20,
            specialcharacter: true
        },
        'conferma_password':{
            equalTo: '#password',
            minlength: 4,
            maxlength: 20
        },
        'indirizzo': {
            required: true,
            minlength: 3,
            maxlength: 50
        },
        'citta':{
            required: true,
            lettersonly: true,
            minlength: 3,
            maxlength: 50
        },
        'descrizione':{
            required: true,
            maxlength: 245
        },
        'codice_postale':{
            required: true,
            number: true,
            minlength: 5,
            maxlength: 50
        }
    },
    messages:
    {
        'username':{
            required: "Il campo username è obbligatorio",
            minlength: "Scegli un username di almeno 3 lettere",
            maxlength: "Limite di 30 caratteri superato"
            },
        'email':{
            required: "Il campo email è obbligatorio",
            email: "Inserisci un valido indirizzo email",
            minlength: "Limite minimo di 5 carattere",
            maxlength: "Limite di 50 caratteri superato"
            },
        'password':{
            required: "Il campo password è obbligatorio",
            minlength: "Inserisci una password di almeno 8 caratteri",
            maxlength: "Limite di 20 caratteri superato"
            },
        'conferma_password':{
            equalTo: "Le due password non coincidono",
            minlength: "Inserisci una password di almeno 4 caratteri",
            maxlength: "Limite di 20 caratteri superato"
            },
        'indirizzo': {
            required: "Il campo indirizzo è obbligatorio",
            minlength: "Limite minimo di 3 caratteri",
            maxlength: "Limite di 50 caratteri superato"
          },
        'citta':{
            required: "Il campo citta è obbligatorio",
            minlength: "Limite minimo di 3 caratteri",
            maxlength: "Limite di 50 caratteri superato"
         },
        'codice_postale':{
            required: "Il campo codice postale è obbligatorio",
            number: "Inserisci 5 numeri",
            minlength: "Inserisci 5 numeri",
            maxlength: "Limite di 5 numeri"
        },
        'descrizione':{
            required: "Il campo descrizione è obbligatorio",
            maxlength: "Limite di 245 caratteri superato"
        }
    }
});

$( '#RegFormShop2' ).validate({
    rules: {
        'username':{
            required: true,
            minlength: 3,
            maxlength: 30
        },
        'email':{
            required: true,
            email: true,
            minlength: 5,
            maxlength: 50
        },
        'password':{
            required: true,
            minlength: 4,
            maxlength: 20,
            specialcharacter: true
        },
        'conferma_password':{
            equalTo: '#password',
            minlength: 4,
            maxlength: 20
        },

        'indirizzo': {
            required: true,
            minlength: 3,
            maxlength: 50
        },
        'citta':{
            required: true,
            lettersonly: true,
            minlength: 3,
            maxlength: 50
        },
        'telefono':{
            required: true,
            number: true,
            minlength: 9,
            maxlength: 30
        },
        'descrizione':{
            required: true,
            maxlength: 245
        },
        'codice_postale':{
            required: true,
            number: true,
            minlength: 5,
            maxlength: 5
        }
    },
    messages:
    {
        'username':{
            required: "Il campo username è obbligatorio",
            minlength: "Scegli un username di almeno 3 lettere",
            maxlength: "Limite di 30 caratteri superato"
            },
        'email':{
            required: "Il campo email è obbligatorio",
            email: "Inserisci un valido indirizzo email",
            minlength: "Limite minimo di 5 carattere",
            maxlength: "Limite di 50 caratteri superato"
            },
        'password':{
            required: "Il campo password è obbligatorio",
            minlength: "Inserisci una password di almeno 4 caratteri",
            maxlength: "Limite di 20 caratteri superato"
            },
        'conferma_password':{
            equalTo: "Le due password non coincidono",
            minlength: "Inserisci una password di almeno 4 caratteri",
            maxlength: "Limite di 20 caratteri superato"
            },
        'indirizzo': {
            required: "Il campo indirizzo è obbligatorio",
            minlength: "Limite minimo di 3 caratteri",
            maxlength: "Limite di 50 caratteri superato"
          },
        'citta':{
            required: "Il campo citta è obbligatorio",
            minlength: "Limite minimo di 3 caratteri",
            maxlength: "Limite di 50 caratteri superato"
         },
        'telefono':{
            required: "Il campo telefono è obbligatorio",
            number: "Inserisci un numero valido",
            minlength: "Limite minimo di 9 caratteri",
            maxlength: "Limite di 30 caratteri superato"
         },
        'codice_postale':{
            required: "Il campo codice postale è obbligatorio",
            number: "Inserisci 5 numeri",
            minlength: "Inserisci 5 numeri",
            maxlength: "Limite di 5 numeri"
         },
        'descrizione':{
            required: "Il campo descrizione è obbligatorio",
            maxlength: "Limite di 245 caratteri superato"
        }
    }
});
