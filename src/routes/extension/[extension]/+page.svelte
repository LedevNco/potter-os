<script>
    import { page } from '$app/stores';


    function getComponent(name) {
        return import(`/src/lib/extensions/${name}/config/${name}.svelte`);
    }

</script>

{#await getComponent($page.params.extension)}
    <li>Loading</li>
{:then component}
    <svelte:component this={component.default} />
{:catch error}
    <li>Erreur: {error.message}</li>
{/await}