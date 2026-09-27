# platform/

Accés a capacitats del dispositiu (xarxa, moviment, geolocalització, compartir, emmagatzematge, vibració, notificacions) darrere d'interfícies petites. Avui hi ha la implementació web; quan arribi Capacitor s'hi afegirà la nativa sense tocar la UI.

Regla: els components de `ui/` i les rutes no criden APIs del navegador directament; ho fan a través d'aquesta capa.
