/**********************************************************/
/**** TP 1 : Jeu de Tic-tac-toe en HTML/CSS/JavaScript ****/
/**** Fait par :        		Fatima Boumhamdi       ****/
/**** Date fin de remise : 	14 Mai 2023                ****/
/**********************************************************/

/* Déclarayion des constantes */
const ZERO = 0; // Représente le "O"
const IXE = 1; // Représente le "X"
const RIEN = 2; // Représente une cellule vide
const SYMBOLES = [ "O", "X", "." ];

/* Déclaration des variables globaux */
var auJeu = false; // Vrai si un jeu est en cours
var AQui = ZERO; // Contenu IXE ou ZERO
var Joueurs = [ "", "" ]; // Contenant pour le nom des joueurs
var hoverGo = true; // true permet la coloration sur passage de la souris
var gagnantAffiche = false; //true permet d'indiquer si on a affiché le gagnant

/* Execution du code js apres chargement de la page web
 * Ajout des évenements apres chargement de la page web*/
window.onload = function(){

	/* Appel de la methode JeuSolo() en cliquant sur le bouton jouer contre l'ordinateur */
	document.getElementById("vsordinateur").addEventListener("click", JeuSolo);

	/* Appel de la méthode JeuADeux() en cliquant sur le bouton  Jouer à deux joueurs*/
	document.getElementById("deuxjoueurs").addEventListener("click", JeuADeux);

	/* Appel de la méthode remiseZéro en cliquant sur le bouton remise à zéro */
	document.getElementById("remisezero").addEventListener("click", remiseZero);

	/**
	 * Dans le cas d'un jeu en cours, si on veux l'interrompre et commencer un nouveau jeu en cliqant
	 * sur le button 'Jouer à deux'. un message est affiché pour choisir de continuer le jeu en cours
	 * ou bien l'arreter et recommancer un nouveau jeu.
	 * On récupère l'item 'reloading' et on lance la méthode JeuADeux() son état (true ou false)
	 *https://stackoverflow.com/questions/41904975/refresh-page-and-run-function-after-javascript
	*/
	var reloading = sessionStorage.getItem("reloading");
	if (reloading) {
		sessionStorage.removeItem("reloading");
		JeuADeux();
	}
	


}
/* Change la couleur d'une cellule de table quand elle est survolée par la souris */
function Hover(e, etat) {
	if(hoverGo){
		var position = e.id;
		e.style.backgroundColor = ( etat ? "rgb(250, 209, 199)" : "White" );
	}
} // Hover()

/* Lancée par le bouton Jouer à deux joueurs, il s'agit du
point d'entrée du jeu.
Cette fonction place aussi la variable auJeu à true.
Puis avant de quitter, appel la fonction JoueurSuivant().*/
function JeuADeux(){
	//Véfifier si un jeu est en cours
	if(auJeu)
	{
		if(confirm('Un jeu est en cours!\nVoulez-vous arrèter ce jeu et recommencer un nouveau?'))
		{
			reloadP();
		}
	}else{
		//alert(" AQui "+AQui+" auJeu "+auJeu+" Joueurs[0] "+Joueurs[0]+" hoverGo "+hoverGo);
		if(gagnantAffiche){
			reloadP();
		}
		if ((initJoueur(IXE)) && (initJoueur(ZERO))){
			auJeu = true ;
			JoueurSuivant();
		} else {
			remiseZero();
		}
	}
	
}//JeuADeux()

/* Quéris le nom d'un joueur via la fonction alert().
Appelé par la fonction JeuADeux()
Le paramètre est l'une des constantes IXE ou ZERO
et placera le nom reçu de alert() dans le tableau Joueurs[]
à l'indice (0 ou 1) correspondant au paramètre passé. */
function initJoueur( quel ){
	let nomJoueur = prompt('Entrer le nom du joueur ('+SYMBOLES[quel]+') :', 'Saisir le nom ici');
	if ( (nomJoueur != null) && (nomJoueur != 'Saisir le nom ici') && (nomJoueur != '') ){		
			Joueurs[quel] = nomJoueur;
		return true;
	}
	return false;
}//initJoueur()

/* Lancée par le bouton Jouer contre l'ordinateur
affichera seulement le message 'Pas prèt!' */
function JeuSolo(){
	if(!auJeu){
		alert('Pas prèt!');
	}else {
		alert('Un jeu est en cours!!!');
	}
	
}//JeuSolo()

/* Lancée pour arrêter la partie, effacer les noms des jouers et vider
la grille.  */
function remiseZero(){
	if(	(!auJeu) || 
		(auJeu && (confirm('Un jeu est en cours!\nVoulez-vous vraiment arrèter le jeu?')))){
			window.location.reload();
		}
}
/* Une fois qu'un joueur à joué, cette fonction est appelée
afin de basculer le jeu vers l'autre joueur.
Elle basculera donc le contenu de la variable AQui
de IXE vers ZERO ou l'inverse.
Elle placera un message informant à qui le tour dans la
zone texte à fond grisé située au bas de l'écran.
Ce message prendra la forme suivante dépendamment à qui
sera le tour de jouer :
C'est à Utilisaterur1 (X) de jouer
C'est à Utilisaterur2 (O) de jouer */
function JoueurSuivant(){
	AQui = ( (AQui == IXE)? ZERO : IXE);
	document.getElementById("msg").innerHTML = "C'est à "+Joueurs[AQui]+" ("+SYMBOLES[AQui]+") de jouer";
}// JoueurSuivant()


/* Traite le clic de souris sur une cellule de la table
Attachée à l'évènement onClick , cette fonction recevra
this de l'événement et effectuera:
Tester la variable auJeu et quitter sans rien faire si false.
Lancer celluleOccupee() et quitter sans rien faire si false.
Appel la fonction celluleOccupee( e ) et quittera sans rien
faire si cette fonction retourne false.
À l'aide du paramètre e (soit la valeur this). elle ira placer
le symbole correspondant au joueur actuel dans la cellule
correspondant à e (ou this)*/
function Clic( e ) {
	if(auJeu){
		if(!celluleOccupee(e)){
			if(AQui == IXE){
				e.innerHTML = "X";
			}else {
				e.innerHTML = "O";
			}
			if(TestGagnant()){
				//fin du jeu par un gagnant ou match null
				auJeu = false;
				Gagnant();
			}else{
				//pas de gagnant ou match null
				JoueurSuivant();
			}
		}
	}
			// Affiche X ou O selon le joueur actif
} // Clic()

/* Après chaque coup joué, il faut vérifier s'il y a un gagnant.
Cette fonction vérifiera à tour de rôle chaque rangée,
chaque colonne et chaque diagonale (i.e. chaque trio)
ainsi qu'un test de match null (grille pleine).
Si un de ces trios est gagnant, la fonction est terminée à
cet endroit après avoir appelé:
coloreXXX(quelle) pour colorer le trio gagnant
gagnant(lequel) pour afficher le gagnant et terminer le jeu.
puis retournera true pour signaler la fin du jeu.
Si aucun de ces cas intercepte le déroulement false sera
retourné pour signifier de continuer à jouer.*/
function TestGagnant(){
	//Vérifier les lignes
	var cellElt1, cellElt2, cellElt3;
	for(let i = 1; i <= 3; i++)
	{
		cellElt1 = document.getElementById(i+"1");
		cellElt2 = document.getElementById(i+"2");
		cellElt3 = document.getElementById(i+"3");
		if(( cellElt1.innerHTML == cellElt2.innerHTML)
			&& (cellElt1.innerHTML == cellElt3.innerHTML)
			&& (cellElt1.innerHTML != SYMBOLES[2]))
		{
				coloreRang(i);
				return true;
		}		
	}
	
	//Vérifier les colonnes
	for(let i = 1; i <= 3; i++){
		cellElt1 = document.getElementById("1"+i);
		cellElt2 = document.getElementById("2"+i);
		cellElt3 = document.getElementById("3"+i);
		if(( cellElt1.innerHTML == cellElt2.innerHTML)
			&& (cellElt1.innerHTML == cellElt3.innerHTML)
			&& (cellElt1.innerHTML != SYMBOLES[2])){
				coloreCol(i);
				return true;
		}		
	}
	
	//Vérifier les diagonales
	cellElt1 = document.getElementById("11");
	cellElt2 = document.getElementById("22");
	cellElt3 = document.getElementById("33");
	if(( cellElt1.innerHTML == cellElt2.innerHTML)
		&& (cellElt1.innerHTML == cellElt3.innerHTML)
		&& (cellElt1.innerHTML != SYMBOLES[2])){
			coloreDiag(ZERO);
			return true;
	}
	cellElt1 = document.getElementById("13");
	cellElt2 = document.getElementById("22");
	cellElt3 = document.getElementById("31");
	if(( cellElt1.innerHTML == cellElt2.innerHTML)
		&& (cellElt1.innerHTML == cellElt3.innerHTML)
		&& (cellElt1.innerHTML != SYMBOLES[2])){
			coloreDiag(IXE);
			return true;
	}			
	
	//Vérifier si match null
	var cptOccup = 0;
	let i = 1;
	let j = 1;
	while(i <= 3)
	{
		while(j <= 3)
		{
			var elt = document.getElementById(i+""+j);
			if(celluleOccupee(elt)){
				cptOccup++;				
			}
			j++;
		}
		j = 1;
		i++;
	}
	if(cptOccup == 9){
		AQui = -1;//personne n'a gagné
		return true;
	}
	
	return false;
}//TestGagnant()

/* ci, il s'agit de trois fonctions.
Chacune colore le fond de cellule du rang concerné.
coloreRang(...) Colore les trois cellules du rang gagnant.
coloreCol(...) Colore les trois cellules du rang gagnant.
coloreDiag(...) Colore les trois cellules du rang gagnant.
L'information passée entre parenthèse indique quel rang
est à colorer.*/
function coloreRang(quelle){
	hoverGo = false;
	for(let i = 1; i <= 3; i++)
	{
		document.getElementById(quelle+""+i).style.backgroundColor="rgb(189, 247, 102)";
	}
}//coloreRang()
function coloreCol(quelle){
	hoverGo = false;
	for(let i = 1; i <= 3; i++)
	{
		document.getElementById(i+""+quelle).style.backgroundColor="rgb(189, 247, 102)";
	}
}//coloreCol()
function coloreDiag(quelle){
	hoverGo = false;
	if(quelle == ZERO){
		for(let i = 1; i <= 3; i++){
			document.getElementById(i+""+i).style.backgroundColor="rgb(189, 247, 102)";
		}
	}else{
		for(let i = 1; i <= 3; i++){
			let j = 4 - i;
			document.getElementById(i+""+j).style.backgroundColor="rgb(189, 247, 102)";
		}
	}
}//coloreDiag()


/* À partir du paramètre, cette fonction affichera un message
dans la zone texte à fond grisé située au bas de l'écran.
Le message prendra la forme suivante s'il y a un gagnant:
Marcel a gagné!
Alain a gagné!
<<< Match null >>>
et mettra la variable auJeu à false.*/
function Gagnant(){
	if((AQui == IXE) || (AQui == ZERO)){
		document.getElementById("msg").innerHTML = Joueurs[AQui]+" a gagné!";
		document.getElementById("msg").classList.add('animegagnant');
	}else{
		document.getElementById("msg").innerHTML = "<< << << Match null >> >> >>"
	}
	gagnantAffiche = true;
}//Gagnant() 

/* Retourne true si le clic s'est fait dans une cellule occupée.*/
function celluleOccupee(e){
	var celText = e.innerHTML;
	if(celText == SYMBOLES[ZERO] || celText == SYMBOLES[IXE]){
		return true;
	}
	return false;
}//celluleOccupee() 

/**
 * Dans le cas d'un jeu en cours, si on veux l'interrompre et commencer un nouveau jeu en cliqant
 * sur le button 'Jouer à deux'. un message est affiché pour choisir de continuer le jeu en cours
 * ou bien l'arreter et recommancer un nouveau jeu.
 * La fonction suivante prise de la page suivante permet de refair le refresh de notre page. 
 * Tout en mettant l'item 'reloadin3g' à 'true'
 *https://stackoverflow.com/questions/41904975/refresh-page-and-run-function-after-javascript
 */
function reloadP() {
    sessionStorage.setItem("reloading", "true");
    document.location.reload();
}