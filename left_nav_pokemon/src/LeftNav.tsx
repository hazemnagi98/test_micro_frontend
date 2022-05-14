// @ts-ignore
import React, {useState, useEffect, createContext, Context, useRef} from "react";
import "./LeftHandNav.scss"
// @ts-ignore
import {BrowserRouter as Router, Routes, Route, Link, useHistory} from "react-router-dom";
// import Pokemon from "./pokemon/Pokemon";
// @ts-ignore
import Pokemon from "pokemon/Pokemon";
import Collapsible from "react-collapsible";

function LeftNav() {

    const listInnerRef = useRef();
    let counter = 0;
    // @ts-ignore
    let url = "https://pokeapi.co/api/v2/pokemon/?limit=200";
    let next = "";
    let [unfiltered, setUnfiltered] = useState<any[]>([])
    let [filtered, setFilter] = useState<any[]>([])
    let [searchTerm, setSearchTerm] = useState<any[]>([])
    let [items, setItems] = useState<any[]>([])
    let [selected, setSelected] = useState<any[]>()
    let [urlState, setUrl] = useState<any[]>([]);
    let handleScroll = async ( e:any) => {
        let b = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if ( b) {
            console.log("scrolling")
            await fetchItems();
        }
    };

    useEffect(()=> {fetchItems();},[counter] );

    let fetchFromURL= async (input: string) => {
        let data = await fetch(input);
        let items = await data.json();
        setUrl(items.next);
        next = items.next;
        let results = items.results;
        return results
    }

    let fetchItems= async () => {
        let urlLocal = urlState.length === 0 ? url : urlState
        // @ts-ignore

        let these : [] = await fetchFromURL(urlLocal);
        let nextResults : []  = await fetchFromURL(next);
        // @ts-ignore
        let total: never[] | ((prevState: never[]) => never[]) = [] ;
        // @ts-ignore
        items.forEach(x=> total.push(x))
        // @ts-ignore
        these.forEach(x=> total.push(x))
        // @ts-ignore
        nextResults.forEach(x=> total.push(x))
        setItems(total);
    }

    const getLi = (item:any, id:number) =>{
        let li =
            <div id={item.name + "-" + id}>
                <li className="listItems" key={id}>
                    <div onClick={()=>{setSelected(item.name)}}>
                        {item.name}
                    </div>
                </li>
            </div>
        return li;
    }
    let id = 0;

    let doSearchTerm =(e: any) => {
        setSearchTerm(e.target.value)
    }
    let filter = () => {
        let toFilterBy = items;
        if(items.length < unfiltered.length){
            setItems(unfiltered)
            toFilterBy = unfiltered;
        }
        else {
            setUnfiltered(items);
        }
        let filtered = toFilterBy.filter(x => x.name.includes(searchTerm));
        setItems(filtered);
    }

    function getPokeList() {
        // @ts-ignore
        return <ul onScroll={handleScroll} className="list" ref={listInnerRef}>
            <Collapsible trigger="Pokemon" className="listItems">
                <input onChange={doSearchTerm} onBlur={filter}/>
            </Collapsible >
            {items.map(item => getLi(item, ++id))}
        </ul>;
    }

    function getPokemon() {
        let div1 = <React.Fragment/>
        if(selected){
           div1 = <div className="list">
                <Pokemon name={selected}/>
            </div>;
        }
        return div1;
    }

    function getList() {
        return <div className="dark" ref={listInnerRef}>
            <div className="hbox">
                {/*<Routes>*/}
                {/*<Router>*/}
                <div id="pokemonNav">
                    {getPokeList()}
                </div>
                {getPokemon()}
                {/*</Router>*/}
                {/*</Routes>*/}
            </div>
        </div>;
    }

// @ts-ignore
    let div = getList()
    return div
}
export default LeftNav;