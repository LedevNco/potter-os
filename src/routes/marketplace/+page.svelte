<script>
    import { onMount } from 'svelte';
    import { browser } from "$app/environment";


    let pclass = "dnone";
    let ext_name = "test";

    let ext_cmp = null;
    let first = true;
    let extensions = [];
    let search_terms = "";
    let s_index = 0;
    let chips = [{name: "Tous", selected: true}, {name: "Installées", selected: false}, {name: "Non installées", selected: false}];
    let filtered_extensions = generatePromise();


    function generatePromise() {
        return new Promise((resolve, reject) => {
            getData(first).then((data) => {
                first = false;
                let dd = data;

                if(search_terms) {
                    console.log(search_terms);
                    dd = data.filter((ext) => ext.name.toLowerCase().includes(search_terms.toLowerCase()) || ext.author.toLowerCase().includes(search_terms.toLowerCase()));
                }

                if(s_index == 0) {
                    filtered_extensions = dd.sort((a, b) => a.name.localeCompare(b.name));
                } else if(s_index == 1) {
                    filtered_extensions = dd.filter((ext) => ext.installed).sort((a, b) => a.name.localeCompare(b.name));
                } else if(s_index == 2) {
                    filtered_extensions = dd.filter((ext) => !ext.installed).sort((a, b) => a.name.localeCompare(b.name));
                }

                resolve(dd);
            });
        });
    }

    function getData(first = false) {
        /*if (browser) {
            return fetch("/api").then(r => r.json());
        } else {
            return Promise.resolve({"text": "Server side rendering"});
        }*/
        if(!first) {
            return Promise.resolve(extensions);
        }
        extensions = [{
            icon: "https://icones.pro/wp-content/uploads/2021/07/cloud-day-forecast-rain-rainy-icon-2048x2048.png",
            name: "Weather",
            version: "1627776000000",
            author: "PotterOs",
            installed: false,
        }, {
            icon: "https://icones.pro/wp-content/uploads/2021/07/cloud-day-forecast-rain-rainy-icon-2048x2048.png",
            name: "Reather",
            version: "1627776000000",
            author: "Nco",
            installed: true,
        }
        ]

        return Promise.resolve(extensions);
    }

    function getComponent(name) {
        /* @vite-ignore */
        return import(`/src/lib/extensions/${name}/client/${name}.svelte`);
    }

    function getComponentServer(name) {
        return import(`/src/lib/extensions/${name}/config/${name}.svelte`);
    }

    function diseaper() {

        pclass = "hidden";
        setTimeout(() => {
            pclass = "dnone";
        }, 200);
    }

    function openConfig(extension) {
        ext_name = extension.displayName;
        pclass = "";
        ext_cmp = extension.name;
    }


    function getVersion(timestamp) {
        return new Date(Number(timestamp)).toLocaleString().split(" ")[0];
    }

    function changeChip(index) {
        chips.forEach((chip, i) => {
            if (i == index) {
                chips[i].selected = true;
            } else {
                chips[i].selected = false;
            }
        });
        s_index = index;
        filtered_extensions = generatePromise();

    }

</script>

<div class="content">


    <div class="popup {pclass}">
        <div class="title"><h3>Configuration de {ext_name}</h3> <i on:click={diseaper} class="bi bi-x-lg"></i></div>
        {#if ext_cmp != null}
        {#await getComponentServer(ext_cmp)}
            <div class="extensionloading"></div>
        {:then cmp}
            <div class="mgt">
            <svelte:component this={cmp.default} />
            </div>
        {:catch e }
            <div class="extensionloading">{e.message}</div>
        {/await}
        {/if}

    </div>
    <div class="overlay {pclass}" on:click={diseaper}></div>
    <div class="flexinline"><h1>PotterOs - Marketplace</h1><input on:input={(value) => {search_terms=value.target.value; filtered_extensions = generatePromise()}}  class="searchbox" placeholder="Rechercher" type="text"> </div>

    <div class="allextensions">
        <div class="chips">
            {#each chips as chip, index }
                <div class="chip" on:click={() => changeChip(index) } class:selected={chip.selected}><span>{chip.name}</span></div>
            {/each}
        </div>
        <div class="list">
            {#await filtered_extensions }
                <div class="extensionloading"></div>
            {:then extensions}
                {#each extensions as extension}
                    <div class="extension">
                        <div class="extension-icon" style="background-image: url('{extension.icon}')"></div>
                        <div class="middle">
                            <span><h3>{extension.name}</h3> by {extension.author}</span>
                            <div class="version"><p>Version {getVersion(extension.version)}</p> <a on:click={() => openConfig(extension)}><i class="bi bi-gear-fill"></i></a></div>
                        </div>
                    </div>
                {/each}
            {/await}

        </div>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
    }
    * {
        font-family: 'Urbanist', sans-serif;
    }

    .content {
        padding: 1rem;
    }

    h1 {
        margin: 0;
    }

    .mgt {
        flex:1;
        color: white;
        overflow: auto;
        padding: 0.3rem 1rem;
    }

    .installed {
        margin-top: 2rem;
    }

    .extinstalled {
        background-color: #983737 !important;
    }

    .popup {
        position: fixed;
        display: flex;
        top: 10vh;
        left: 10vw;
        width: 80vw;
        height: 80vh;
        max-width: 80vw;
        max-height: 80vh;
        overflow: auto;
        border-radius: 5px;
        background-color: #282828;
        justify-content: space-between;
        flex-flow: column nowrap;
        z-index: 99999;
        animation: appear 0.3s ease-in-out forwards;
    }



    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(40, 40, 40, 0.18);
        z-indexm: 9999;
    }

    .hidden {
        animation: hide 0.3s ease-in-out forwards;
    }

    .dnone {
        display: none;
    }

    .title {
        position: sticky;
        width: calc(100% - 3rem);
        max-width: calc(100% - 3rem);
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        color: white;
        padding: 0.5rem 1.5rem;
        align-items: center;
        background-color: #313131;
        border-radius: 5px 5px 0 0;
    }

    .title > i {
        padding: 9px 10px;
        cursor: pointer;
        border-radius: 50%;
        transition: 0.2s ease-in-out;
    }

    .title > i:hover {
        background-color: #3a3a3a;
        transition: 0.2s ease-in-out;
    }

    .title > h3 {
        margin: 0;
        font-size: 1.2rem;
    }



    .extension {
        display: flex;
        flex-flow: row nowrap;
        min-width: fit-content;
        justify-content: flex-start;
        align-items: center;
        color: white;
        max-width: calc(calc(100vw - 2rem) / 3);
        flex: 1;
        border-radius: 5px;
        background-color: #282828;
    }


    .extension-icon {
        width: 100px;
        height: 100px;
        background-position: center;
        background-size: 80% 80%;
        background-repeat: no-repeat;
    }

    .middle {
        display: flex;
        gap: 1rem;
        flex: 1;
        flex-flow: column nowrap;
        padding: 1rem 2rem 1rem 1rem;
        justify-content: center;
    }


    .extensionloading {
        width: 100px;
        height: 84px;
        border-radius: 5px;
        background-color: #757575;
        animation: skeleton 2s infinite ease-in-out;
    }

    .middle > span {
        display: flex;
        flex-flow: row nowrap;
        gap: 7px;
        align-items: baseline;
    }

    .middle > span > h3 {
        margin: 0;
    }

    .middle > .version > p {
        margin: 0;
        font-size: 0.8rem;
    }

    .middle > .version {
        display: flex;
        flex-flow: row nowrap;
        gap: 10px;
        align-items: center;
        width: 100%;
        justify-content: space-between;
    }

    .version i {
        font-size: 1.2rem;
        cursor: pointer;

    }

    .version a:hover {
        transform: rotate(45deg) scale(1.1);
        transition: transform 0.2s ease-in-out;
    }

    .version > a {
        color: white;
        transform: rotate(0deg);
        transition: transform 0.2s ease-in-out;
    }

    .list {
        display: flex;
        flex-flow: row wrap;
        gap: 10px;
        justify-content: left;
        flex-grow: 0;
    }


    .flexinline {
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
    }

    .searchbox:focus {
        width: 40%;
        transition: width 0.2s ease-in-out;
    }

    .searchbox {
        display: flex;
        flex-flow: row nowrap;
        gap: 10px;
        align-items: center;
        justify-content: center;
        width: 65px;
        padding: 0.5rem 1rem;
        background-color: #313131;
        border: none;
        border-radius: 5px;
        transition: width 0.2s ease-in-out;
        color: white;
    }

    .chips {
        margin-top: 1rem;
        display: flex;
        flex-flow: row wrap;
        gap: 10px;
        align-items: center;
    }

    .chip.selected {
        background-color: #313131;
        color: #ffffff;
    }

    .chip {
        background-color: #ffffff;
        color: black;
        border: 1px solid #313131;
        border-radius: 8px;
        font-size: 0.9rem;
        padding: 0.4rem 0.8rem;
        margin-bottom: 2rem;
        cursor: pointer;
        user-select: none;
    }


    @keyframes skeleton {
        0% {
            opacity: 0.8;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0.8;
        }

    }

    @keyframes hide {
        0% {
            opacity: 1;
        }

        100% {
            opacity: 0;
        }

    }

    @keyframes appear {
        0% {
            transform: scale(0.95);
        }

        50% {
            transform: scale(1.05);
        }

        100% {
            transform: scale(1);
        }

    }
</style>