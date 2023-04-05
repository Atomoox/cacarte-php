<script src="https://unpkg.com/leaflet@1.3.1/dist/leaflet.js" integrity="sha512-/Nsx9X4HebavoBvEBuyp3I7od5tA0UzAxs+j83KgC8PU0kgB4XiK4Lfe4y4cgBtaRJQEIFCW+oC506aPT2L1zw==" crossorigin=""></script>
   
<script src="../ressources/js/map.js"></script>

<script src="../ressources/js/prompt.js" type="module" defer></script>

<form action="" method="post" class="flex--row map">
    <fieldset data-stylefun="prompt.getStyle()">
        <div class="flex--row header">
            <div class="flex--column">
                <h1 data-textfun="prompt.getTitle()">
                    Plus court chemin
                </h1>
                <span data-textfun="prompt.getDesc()">
                    Trouvez le plus court chemin entre deux villes
                </span>
            </div>
            <div class="hide" data-onclick="prompt.changeState()" data-textfun="prompt.getButtonText()"></div>
        </div>

        <p class="InputAddOn">
            <label class="InputAddOn-item" for="nomCommuneDepart_id">Nom de la commune de départ</label>
            <input class="InputAddOn-field" type="text" value="" placeholder="Ex : Menton" name="nomCommuneDepart" id="nomCommuneDepart_id" required>
        </p>
        <p class="InputAddOn">
            <label class="InputAddOn-item" for="nomCommuneArrivee_id">Nom de la commune d'arrivée</label>
            <input class="InputAddOn-field" type="text" value="" placeholder="Ex : Menton" name="nomCommuneArrivee" id="nomCommuneArrivee_id" required>
        </p>
        <input type="hidden" name="XDEBUG_TRIGGER">
        <p>
            <input class="InputAddOn-field" type="submit" value="Calculer" />
        </p>
    </fieldset>

    <div id="mapcaca"></div>
</form>

<script>
    let villeDepart = false, villeArrivee = false, distance = false;
    initMap();
</script>
<script src="../ressources/js/drag.js"></script>

<?php if (!empty($_POST)) { ?>
    <script src="../ressources/js/ajax.js"></script>
    
    <p>
        Le plus court chemin entre <?= $nomCommuneDepart ?> et <?= $nomCommuneArrivee ?> mesure <?= $distance ?>km.
    </p>
    <p id="meteo1"></p>
    <p id="meteo2"></p>
    <script>
        villeDepart = "<?= $nomCommuneDepart ?>";
        villeArrivee = "<?= $nomCommuneArrivee ?>"
        distance = "<?= $distance ?>";
        displayBothMeteo(villeDepart, villeArrivee);
    </script>
<?php } ?>