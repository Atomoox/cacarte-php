<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= $pagetitle ?></title>
    <link rel="stylesheet" href="../ressources/css/forms.css">
    <link rel="stylesheet" href="../ressources/css/global.css">
    <link rel="stylesheet" href="../ressources/css/layout.css">
    <link rel="stylesheet" href="../ressources/css/map.mobile.css">
    <link rel="stylesheet" href="../ressources/css/results.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.1/dist/leaflet.css" integrity="sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ==" crossorigin="" />
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/leaflet.markercluster@1.3.0/dist/MarkerCluster.css" />
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/leaflet.markercluster@1.3.0/dist/MarkerCluster.Default.css" />
</head>
<body>
    <header>
        <nav class="flex--row">
            <a href="controleurFrontal.php">
                <div class="flex--column">
                    <span class="title">Cacarte</span>
                    <span class="subtitle">Mapping & Co.</span>
                </div>    
            </a>
            <a href="./controleurFrontal.php?action=plusCourtChemin&controleur=noeudCommune">Map</a>
            <a href="controleurFrontal.php?action=afficherListe&controleur=utilisateur">Utilisateurs</a>
            <a href="controleurFrontal.php?action=afficherListe&controleur=noeudCommune">Communes</a>
                <?php

                use App\PlusCourtChemin\Lib\ConnexionUtilisateur;

                if (!ConnexionUtilisateur::estConnecte()) {
                    echo <<<HTML
                        <a href="controleurFrontal.php?action=afficherFormulaireConnexion&controleur=utilisateur">
                            <img alt="login" src="../ressources/img/enter.png" width="18">
                        </a>
                    HTML;
                } else {
                    $loginHTML = htmlspecialchars(ConnexionUtilisateur::getLoginUtilisateurConnecte());
                    $loginURL = rawurlencode(ConnexionUtilisateur::getLoginUtilisateurConnecte());
                    echo <<<HTML
                        <a href="controleurFrontal.php?action=afficherDetail&controleur=utilisateur&login=$loginURL">
                            <img alt="user" src="../ressources/img/user.png" width="18">
                            $loginHTML
                        </a>
                        <a href="controleurFrontal.php?action=deconnecter&controleur=utilisateur">
                            <img alt="logout" src="../ressources/img/logout.png" width="18">
                        </a>
                    HTML;
                }
                ?>
            </ul>
        </nav>
        <div>
            <?php
            foreach (["success", "info", "warning", "danger"] as $type) {
                foreach ($messagesFlash[$type] as $messageFlash) {
                    echo <<<HTML
                    <div class="alert alert-$type">
                        $messageFlash
                    </div>
                    HTML;
                }
            }
            ?>
        </div>
    </header>
    <main>
        <?php
        /**
         * @var string $cheminVueBody
         */
        require __DIR__ . "/{$cheminVueBody}";
        ?>
    </main>
    <footer>
        <p>
           Copyright Cacarte Corporation & Co. 
        </p>
    </footer>
</body>

</html>