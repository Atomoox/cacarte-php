<form action="" method="post">
    <fieldset>
        <div class="flex--row header">
            <div class="flex--column">
                <h1>
                    Plus court chemin
                </h1>
                <span>
                    Deux destinations, une distance.
                </span>
            </div>
            <div class="beta">
                Beta
            </div>
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
</form>

<?php if (!empty($_POST)) { ?>
    <script src="./ressources/js/ajax.js"></script>
    <p>
        Le plus court chemin entre <?= $nomCommuneDepart ?> et <?= $nomCommuneArrivee ?> mesure <?= $distance ?>km.
    </p>
    <p id="meteo1"></p>
    <p id="meteo2"></p>
    <script>
        displayBothMeteo("<?= $nomCommuneDepart ?>", "<?= $nomCommuneArrivee ?>");
    </script>
<?php } ?>