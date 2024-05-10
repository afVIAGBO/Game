// Attendre que le DOM soit entièrement chargé avant d'exécuter le code
document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner l'élément de la grille
    var grille = document.getElementById("grille");

    // Définir les réponses attendues où la valeur de chaque clé est un tableau contenant respectivement le numero , le mot attendu, la ligne du mot puis la colonne du début du mot dans la grille

    const reponsesAttendues = {
        horizontal: {
            "00": [1, "TIEDE", 0, 0],
            "20": [5, "QUI", 2, 0],
            "25": [6, "CA", 2, 5],
            "40": [8, "EH", 4, 0],
            "44": [9, "QUE", 4, 4],
            "62": [11, "RODER", 6, 2]
        },
        vertical: {
            "00": [1,"TAQUETS", 0, 0],
            "02": [2,"ERIC", 0, 2],
            "04": [3, "ET", 0, 4],
            "06": [4, "CHALEUR", 0, 6],
            "34": [7, "CQFD", 3, 4],
            "52": [10, "OR", 5, 2]
        }
    };

    var motcourant = [];  //un tableau contenant l'id et la direction du mot couramment sélectionné

    // Code pour la création de la grille
    // Parcourir chaque ligne et chaque colonne de la grille
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            // Créer une case de la grille
            const caseGrille = document.createElement("div");

            // Définir les positions des cases noires dans un tableau
            const caseNoire = ["05", "11", "13", "15", "23", "24", "31", "33", "35", "42", "43", "51", "53", "55", "61"];

            // Vérifier si la case est noire ou non
            if (caseNoire.includes(i.toString() + j.toString())) {
                caseGrille.classList.add("case-noire");
            }

            else {
                // Si la case n'est pas noire, lui ajouter une classe de style et un numéro si nécessaire
                caseGrille.classList.add("grid-item");
                // Créer un élément span pour afficher le numéro
                const numeros = document.createElement('span');
                numeros.classList.add('numero');

                // Créer une chaîne de caractères contenant les coordonnées de la case
                const numeroCoord = i.toString() + j.toString();

                // Vérifier si les coordonnées correspondent à un numéro
                if (reponsesAttendues.vertical.hasOwnProperty( numeroCoord)){

                        const [num, motAttendu, ligneDebut, colonneDebut] = reponsesAttendues.vertical[numeroCoord];
                        numeros.textContent = num;
                        caseGrille.id = numeroCoord;

                    }
                else if (reponsesAttendues.horizontal.hasOwnProperty(numeroCoord)){

                        const [num, motAttendu, ligneDebut, colonneDebut] = reponsesAttendues.horizontal[numeroCoord];
                        numeros.textContent = num;
                        caseGrille.id = numeroCoord;

                }
                else{
                        //ID des cases pour faciliter la recupération des lettres saisies par l'utilisateur
                        caseGrille.id = numeroCoord;
                    }

                caseGrille.appendChild(numeros);
                }



            // Ajouter la case à la grille
            grille.appendChild(caseGrille);
        }
    }

    //permet de sélectionner les cases
   function selectWord(numero, direction, ligneDebut, colonneDebut, mot) {

        // Si le mot est vide, sélectionner simplement la case
        if (mot === "") {
            const caseGrille = document.getElementById(numero);
            caseGrille.classList.add('selected');
        }
        else {
            // Construire l'ID de la case en fonction de la direction
            let caseId;
            for (let i = 0; i < mot.length; i++) {

                if (direction === "horizontal") {

                    caseId = (ligneDebut).toString() + (colonneDebut + i).toString();
            }

                else {

                    caseId = (ligneDebut + i).toString() + colonneDebut.toString();

                    }


                // Sélectionner la case correspondante et la colorer
                const caseGrille = document.getElementById(caseId);
                caseGrille.classList.add('selected');
            }
        }
    }




    //Pour déselectionner les cases qui ont été selectionnée
    function deselect() {
        // Récupérer toutes les cases sélectionnées
        const casesSelectionnees = document.querySelectorAll('.selected');

        // Parcourir toutes les cases sélectionnées et supprimer la classe "selected"
        casesSelectionnees.forEach(function(caseSelectionnee) {
            caseSelectionnee.classList.remove('selected');
        });

    }



    // Gestionnaire d'événement pour les cases non noires contenant des numéros
    document.querySelectorAll('.grid-item').forEach(function(caseGrille) {
        // L'événement double clicK pour sélectionner le mot vertical 1
        caseGrille.addEventListener('dblclick', function(event) {
            // Désélectionner les cases précédemment sélectionnées
            deselect();
            // Récupérer le numéro de la case
            const id1 = this.id;
            // Vérifier si l'id est celle de la case 1
            if (id1 === "00"){
                const [numero, motAttendu, ligneDebut, colonneDebut] = reponsesAttendues.vertical[id1];
                selectWord(id1, 'vertical', ligneDebut, colonneDebut, motAttendu);
                // Réinitialiser motcourant avec les nouvelles valeurs
                motcourant = [id1, "vertical"];
            }
        });

        caseGrille.addEventListener('click', function() {
            // Vérifier si la case contient un numéro
            const numeroElement = this.querySelector('.numero');
            if (numeroElement && numeroElement.textContent !== '') {
                // Obtenir l'id de la case sélectionnée
                const id_c = this.id;
                let direction, ligneDebut, colonneDebut, mot;
                // Gérer le cas particulier de la case "h00"
                if (id_c === "00") {
                    direction = "horizontal";
                    const [numero, m, lig, col] = reponsesAttendues[direction][id_c];
                    ligneDebut = lig;
                    colonneDebut = col;
                    mot = m;
                }
                else {
                    // Déterminer la direction et obtenir les détails du mot
                    direction = (reponsesAttendues.horizontal.hasOwnProperty(id_c)) ? 'horizontal' : 'vertical';
                    const [numero, m, lig, col] = reponsesAttendues[direction][id_c];
                    ligneDebut = lig;
                    colonneDebut = col;
                    mot = m;
                }
                // Réinitialiser motcourant avec les nouvelles valeurs
                motcourant = [id_c, direction];
                // Désélectionner la case précédemment sélectionnée
                deselect();
                // Sélectionner et colorer les cases du mot
                selectWord(id_c, direction, ligneDebut, colonneDebut, mot);
            }
            else {
                // Obtenir l'id de la case sélectionnée
                const id_c = this.id;
                // Réinitialiser motcourant avec les nouvelles valeurs
                motcourant = [id_c, "horizontal"];
                // Désélectionner les cases précédemment sélectionnées
                deselect();
                // Sélectionner et colorer les cases du mot
                selectWord(id_c, "horizontal", 0, 0, "");
            }
        });
    });



    /*****************************************************************************
      * Gestion des entrées des mots
      *
      *
      *****************************************************************************/

    //vérifie si un mot passé en paramètre ne contient que des lettres alphabetiques
    function estAlphabetique(mot) {
        // Expression régulière qui correspond à des lettres de l'alphabet (minuscules et majuscules)
        const regex = /^[a-zA-Z]+$/;
        return regex.test(mot);

    }

    /*Gestion des croisement
     * renvoie true si le croisement avec les mots est correct
     * false sinon
     */
    function croisement_correct(mot_joue,direction, ligneDebut, colonneDebut){

        let l = ligneDebut;
        let c = colonneDebut
        let ligneFin = ligneDebut + mot_joue.length -1;
        let colonneFin = colonneDebut + mot_joue.length -1;
        let result = true;

        if(direction === "horizontal"){
            let indice = 0;
            while(c<= colonneFin && result === true) {

                //on recupère les id des cases
                let id_case = ligneDebut.toString() + c.toString(); // l'id des cases
                const caseGrille = document.getElementById(id_case);
                const lettre = caseGrille.querySelector('.lettre');

                if(lettre && lettre.textContent !== mot_joue[indice]){
                    result = false;
                }
                c++;
                indice ++;
            }
        }
        else{
            let indice = 0;
            while(l<= ligneFin && result === true) {

                //on recupère les id des cases
                let id_case = l.toString() + colonneDebut.toString(); // l'id des cases
                const caseGrille = document.getElementById(id_case);
                const lettre = caseGrille.querySelector('.lettre');

                if(lettre && lettre.textContent !== mot_joue[indice]){
                    result = false;
                }
                l++;
                indice ++;
            }
        }
        return result;
    }

    var entrer_mot = document.getElementById("bouton-entrer");

    function entrer(){

        const mot_joue = prompt("Entrer votre mot: ");


        if (reponsesAttendues.horizontal.hasOwnProperty(motcourant[0]) && motcourant[1] === "horizontal") {

                const [num ,motAttendu, ligneDebut, colonneDebut] = reponsesAttendues.horizontal[motcourant[0]];
                const longueurMot = motAttendu.length;
                const colonneFin = colonneDebut + longueurMot - 1;

                //on verifie la taille du mot:
                if(mot_joue.length != longueurMot){
                    alert("la taille du mot est incorrect: Veuillez réessayer");
                }
                else{
                    if(estAlphabetique(mot_joue) === false){

                        alert("les mots doivent être alphabetiques");
                    }
                    else{

                        // Diviser le mot en un tableau de sous-chaînes (lettres individuelles)
                        const lettres_joue = mot_joue.split('');

                        // Convertir chaque lettre en majuscule
                        const lettresMajuscules_joue = lettres_joue.map(lettre => lettre.toUpperCase());

                        //on verifie si le croisement avec les autres mot est correct
                        if(croisement_correct(lettresMajuscules_joue, "horizontal", ligneDebut, colonneDebut) === false){

                            alert("le croisement du mot avec les autres mots est incorrect: Veuillez réessayer !!!!");
                        }
                        else{

                            //on remplit la grille
                            let indice = 0;
                            for (let colonne = colonneDebut; colonne <= colonneFin; colonne++) {

                                let id_case = ligneDebut.toString() + colonne.toString();

                                const caseGrille = document.getElementById(id_case);
                                const lettre = caseGrille.querySelector('.lettre');
                                //on verifie si la case est vide

                                if(lettre ){
                                     lettre.textContent = lettresMajuscules_joue[indice];
                                }
                                else{
                                    const l = document.createElement('span');
                                    l.classList.add('lettre');
                                    l.textContent = lettresMajuscules_joue[indice];
                                    caseGrille.appendChild(l);
                                }
                                indice++;

                            }
                        }
                    }
                }
            }
            else if (reponsesAttendues.vertical.hasOwnProperty(motcourant[0]) && motcourant[1] === "vertical") {

                const [num ,motAttendu, ligneDebut, colonneDebut] = reponsesAttendues.vertical[motcourant[0]];
                const longueurMot = motAttendu.length;
                const ligneFin = ligneDebut + longueurMot - 1;

                //on verifie la taille du mot:
                if(mot_joue.length != longueurMot){
                    alert("la taille du mot est incorrect: Veuillez réessayer");
                }
                else{
                    if(estAlphabetique(mot_joue) === false){

                        alert("les mots doivent être alphabetiques");
                    }
                    else{

                        // Diviser le mot en un tableau de sous-chaînes (lettres individuelles)
                        const lettres_joue = mot_joue.split('');

                        // Convertir chaque lettre en majuscule
                        const lettresMajuscules_joue = lettres_joue.map(lettre => lettre.toUpperCase());

                        if(!croisement_correct(lettresMajuscules_joue, "vertical", ligneDebut, colonneDebut)){

                            alert("le croisement du mot avec les autres mots est incorrect: Veuillez réessayer !!!!");
                        }
                        else{
                        //on remplit la grille
                            let indice = 0;
                            for (let ligne = ligneDebut; ligne <= ligneFin; ligne++) {

                                let id_case = ligne.toString() + colonneDebut.toString(); // l'id des cases

                                const caseGrille = document.getElementById(id_case);
                                const lettre = caseGrille.querySelector('.lettre');

                                if(lettre ){
                                     lettre.textContent = lettresMajuscules_joue[indice];
                                }
                                else{
                                    const l = document.createElement('span');
                                    l.classList.add('lettre');
                                    l.textContent = lettresMajuscules_joue[indice];
                                    caseGrille.appendChild(l);
                                }
                                indice++;

                            }
                }
             }
             }
             }
             //le cas où le joueur selectionne une case ne contenant pas de numéros
             else{

                  // Vérifier la validité de la réponse
                if (mot_joue !== "" && mot_joue.length === 1) {


                    if (estAlphabetique(mot_joue)) {

                        let maj = mot_joue.toUpperCase();
                        // Ajouter la lettre dans la case
                        const caseGrille = document.getElementById(motcourant[0]);
                        const lettre = caseGrille.querySelector('.lettre');

                        if(lettre){

                            lettre.textContent = maj;
                        }
                        else{

                            //gestion des lettres dans les cases:
                            const l = document.createElement('span');
                            l.classList.add('lettre');
                            l.textContent = maj;
                            caseGrille.appendChild(l);

                            }
                        }

                    else {
                        // Si la réponse est invalide, demander au joueur de réessayer
                        alert('Réponse invalide. Veuillez entrer une seule lettre majuscule.');
                        }
                }

                else{
                    alert("Vous devez entrer qu'une seule lettre dans cette case.");
                }

            }

   }

   entrer_mot.addEventListener("click", entrer);


 /*****************************************************************************
      * Gestion des modifications des mots
      *
      *
      *****************************************************************************/
    var modif = document.getElementById("bouton-modifier");

    function modifier(){

        effacer_mot();
        entrer();
    }
    modif.addEventListener("click", modifier)


    /*****************************************************************************
      * Gestion des suppressions des mots
      *
      *
      *****************************************************************************/
    var effacer = document.getElementById("bouton-effacer");

    function effacer_mot(){

        if(motcourant.length != 0){

            // Déterminer la direction et obtenir les détails du mot
            direction = motcourant[1];

            if(direction === "horizontal"){
                if(reponsesAttendues[direction][motcourant[0]]){

                    const [numero, mot, ligneDebut, colonneDebut] = reponsesAttendues[direction][motcourant[0]];

                    let colonneFin = colonneDebut + mot.length -1;

                    for(let i = colonneDebut; i <= colonneFin; i ++ ){
                        //on recupère les id des cases
                        let id_case = ligneDebut.toString() + i.toString(); // l'id des cases
                        const caseGrille = document.getElementById(id_case);
                        const lettre = caseGrille.querySelector('.lettre');

                        if(lettre){
                            lettre.remove();
                        }
                    }
                }
                else{
                    const caseGrille = document.getElementById(motcourant[0]);
                    const lettre = caseGrille.querySelector('.lettre');

                        if(lettre){
                            lettre.remove();
                        }
                  }
            }
            else{

                const [numero, mot, ligneDebut, colonneDebut] = reponsesAttendues[direction][motcourant[0]];

                let ligneFin = ligneDebut + mot.length -1;

                for(let i = ligneDebut; i <= ligneFin; i ++ ){
                    //on recupère les id des cases
                    let id_case = i.toString() + colonneDebut.toString(); // l'id des cases
                    const caseGrille = document.getElementById(id_case);
                    const lettre = caseGrille.querySelector('.lettre');

                    if(lettre){
                        lettre.remove();
                    }
                }
            }
        }
    }
    effacer.addEventListener("click", effacer_mot);


    /*****************************************************************************
      * Vérification des mots
      *
      *
      *****************************************************************************/

    var liste_mot_incorrect = []; //pour stocker les mots qui sont incorects

    function verifierGrille() {

        list_mot_incorrect = [];

        // Vérification des mots horizontaux
        for (let numero in reponsesAttendues.horizontal) {

            if (reponsesAttendues.horizontal.hasOwnProperty(numero)) {

                const [num, motAttendu, ligneDebut, colonneDebut] = reponsesAttendues.horizontal[numero];
                const longueurMot = motAttendu.length; //la longeur du mot
                const colonneFin = colonneDebut + longueurMot - 1;

                let motUtilisateur = "";

                // Récupérer les lettres saisies par l'utilisateur pour ce mot horizontal
                for (let colonne = colonneDebut; colonne <= colonneFin; colonne++) {

                    let id_case = ligneDebut.toString() + colonne.toString();

                    const caseGrille = document.getElementById(id_case);
                    const lettre = caseGrille.querySelector('.lettre');
                    if (lettre) {
                        motUtilisateur += lettre.textContent;
                    } else {
                        // Si une case est vide, le mot n'est pas complet
                        break;
                    }
                }

                // Comparer le mot saisi par l'utilisateur avec le mot attendu
                if (motUtilisateur !== motAttendu) {
                    list_mot_incorrect.push(num);
                }
            }
        }

        // Vérification des mots verticaux
        for (let numero in reponsesAttendues.vertical) {

            if (reponsesAttendues.vertical.hasOwnProperty(numero)) {

                const [num, motAttendu, ligneDebut, colonneDebut] = reponsesAttendues.vertical[numero];
                const longueurMot = motAttendu.length;
                const ligneFin = ligneDebut + longueurMot - 1;

                let motUtilisateur = "";

                // Récupérer les lettres saisies par l'utilisateur pour ce mot vertical
                for (let ligne = ligneDebut; ligne <= ligneFin; ligne++) {

                    let id_case = ligne.toString() + colonneDebut.toString(); // l'id des cases

                    const caseGrille = document.getElementById(id_case);
                    const lettre = caseGrille.querySelector('.lettre');

                    if (lettre) {
                        motUtilisateur += lettre.textContent;
                    } else {
                        // Si une case est vide, le mot n'est pas complet
                        break;
                    }
                }

                // Comparer le mot saisi par l'utilisateur avec le mot attendu
                if (motUtilisateur !== motAttendu) {
                     list_mot_incorrect.push(num);
                }
            }
        }

        if(list_mot_incorrect.length === 0){

            // Tous les mots sont corrects
            return true;
        }
        else{

            // un ou plusieurs mots sont incorrects
            return false;
        }
    }


    // Utilisation de la fonction de vérification lorsque le bouton "Vérifier" est cliqué
    const boutonVerifier = document.getElementById("bouton-verifier-reponses");

    boutonVerifier.addEventListener("click",function(){

        if(verifierGrille()){
              alert("Félicitation: vous avez trouvez tous les mots !!!!!!!!!!");
        }
        else{
            list_mot_incorrect = list_mot_incorrect.sort();
            let phrase = "Oups!!!!  les mots: ";
            for(i = 0; i< list_mot_incorrect.length; i++){
                phrase += list_mot_incorrect[i].toString() + ", ";
            }
            phrase += " sont incorects: veuillez les réessayer !!!";
            alert(phrase);
        }

    });

    /*****************************************************************************
      * Gestion de la réinitialisation de la grille
      *
      *
      *****************************************************************************/

   var reinit = document.getElementById("bouton-reInitialiser");

    reinit.addEventListener("click", function(){

        // Récupérer toutes les cases contenant des lettres
        const casesLettre = document.querySelectorAll('.lettre');

        // Parcourir toutes les cases contenant des lettres et les réinitialiser
        casesLettre.forEach(function(caseL) {
            caseL.textContent = ''; // Réinitialiser le contenu texte
            caseL.classList.remove('lettre'); // Supprimer la classe "lettre"
        });
        deselect();
    });


});
