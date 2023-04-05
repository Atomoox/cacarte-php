<div>
    <form method="<?= $method ?>" action="controleurFrontal.php">
        <fieldset>
        <div class="flex--row header">
            <div class="flex--column">
                <h1>
                    Login
                </h1>
                <span>
                    Se connecter a cacarte
                </span>
            </div>
            <div class="beta">
                Créer un compte
            </div>
        </div>
            <p class="InputAddOn">
                <label class="InputAddOn-item" for="login_id">Login</label>
                <input class="InputAddOn-field" type="text" value="" placeholder="Ex : rlebreton" name="login" id="login_id" required>
            </p>
            <p class="InputAddOn">
                <label class="InputAddOn-item" for="mdp_id">Mot de passe</label>
                <input class="InputAddOn-field" type="password" value="" placeholder="" name="mdp" id="mdp_id" required>
            </p>
            <input type='hidden' name='action' value='connecter'>
            <input type='hidden' name='controleur' value='utilisateur'>
            <p>
                <input class="InputAddOn-field" type="submit" value="Se connecter"/>
            </p>
        </fieldset>
    </form>
</div>