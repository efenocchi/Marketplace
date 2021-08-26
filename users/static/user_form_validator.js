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

jQuery.validator.addMethod("username_unique", function(value) {
    var isSuccess = false;

    $.ajax({ url: "/utenti/check_username",
        type: "GET",
        data: "username=" + value,
        async: false,
        dataType:"html",
        success: function(msg) { isSuccess = msg === "True" }
    });
    return isSuccess;
}, "Username non disponibile");

jQuery.validator.addMethod("eta_pet_valida", function(value) {
    return value >= 0 && value <= 100;
}, "L'età deve essere compresa tra 0 e 100 anni");

$( '#user-form' ).validate({
    rules: {
        'username':{
            required: true,
            minlength: 3,
            maxlength: 30,
            username_unique: true
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
            maxlength: 20
        },
        'conferma_password':{
            equalTo: '#password',
            minlength: 4,
            maxlength: 20
        },
        'first_name': {
            required: true,
            lettersonly: true,
            maxlength: 30
        },
        'last_name':{
            required: true,
            lettersonly: true,
            maxlength: 30
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
            minlength: 3,
            maxlength: 30
        },
        'eta':{
            required: true,
            number: true,
            eta_pet_valida: true
        },
        'nome_pet':{
            required: true,
            lettersonly: true,
            minlength: 3,
            maxlength: 30
        },
        'razza':{
            required: true,
            lettersonly: true,
            minlength: 3,
            maxlength: 30
        },
        'caratteristiche':{
            required: true,
            minlength: 1,
            maxlength: 245
        },
        'descrizione':{
            required: true,
            maxlength: 245
        },
        'hobby':{
            required: true,
            maxlength: 95
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
        'first_name': {
            required: "Il campo nome è obbligatorio",
            notNumber: "Caratteri numerici non consentiti",
            maxlength: "Limite di 30 caratteri superato"
          },
        'last_name':{
            required: "Il campo cognome è obbligatorio",
            maxlength: "Limite di 30 caratteri superato"
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
            minlength: "Limite minimo di 3 caratteri",
            maxlength: "Limite di 30 caratteri superato"
         },
        'eta':{
            required: "Il campo età è obbligatorio",
            number: "Inserisci un numero valido"
        },
        'nome_pet':{
            required: "Il campo nome pet è obbligatorio",
            minlength: "Limite minimo di 3 caratteri",
            maxlength: "Limite di 30 caratteri superato"
        },
        'razza': {
            required: "Il campo razza è obbligatorio",
            minlength: "Limite minimo di 3 caratteri",
            maxlength: "Limite di 30 caratteri superato"
        },
        'caratteristiche':{
            required: "Il campo caratteristiche è obbligatorio",
            maxlength: "Limite di 245 caratteri superato"
         },
        'descrizione':{
            required: "Il campo descrizione è obbligatorio",
            maxlength: "Limite di 245 caratteri superato"
        },
        'hobby':{
            required: "Il campo hobby è obbligatorio",
            maxlength: "Limite di 95 caratteri superato"
        }
    }
});
