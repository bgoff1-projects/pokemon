import { connect } from 'react-redux';
import React from "react";
import { getPokemon, addPokemonToParty, removePokemonFromGrid } from "../../actions/index";
import './Pokemon.css';

const mapStateToProps = state => ({
    pokemon: state.pokemon,
    party: state.party,
    typeFilter: state.typeFilter,
    generationFilter: state.generationFilter
});

class View extends React.Component {
    constructor(props) {
        super(props);
        props.dispatch(getPokemon());
    }

    onClick(pokemon, index) {
        if (this.props.pokemon.party.length !== 6) {
            this.props.dispatch(addPokemonToParty({
                name: pokemon.name,
                types: pokemon.types,
                pokemonNumber: pokemon.pokemonNumber,
                region: pokemon.region,
                generation: pokemon.generation
            }));
            this.props.dispatch(removePokemonFromGrid(index));
        }
    }

    filter() {
        if (this.props && this.props.pokemon.all) {
            return this.props.pokemon.all.filter(p => {
                for (const generation in this.props.generationFilter) {
                    if (this.props.generationFilter.hasOwnProperty(generation) && this.props.generationFilter[ generation ] === false
                        && (p.hasOwnProperty('generation') && p.generation === Number.parseInt(generation))) {
                        return false;
                    }
                }
                for (const type in this.props.typeFilter) {
                    if (this.props.typeFilter.hasOwnProperty(type) && this.props.typeFilter[ type ] === true &&
                        (p.types[ 0 ] === type || p.types[ 1 ] === type)) return true;
                }
                return false;
            }).sort((a, b) => {
                if (a.hasOwnProperty('pokemonNumber') && b.hasOwnProperty('pokemonNumber')) {
                    return a.pokemonNumber - b.pokemonNumber;
                }
                return a - b;
            });
        } else return null;
    }

    render() {
        let pokemon = this.filter();
        if (pokemon) {
            return (
                <div className='col-md-8 text-center'>
                    {
                        pokemon.map((poke, index) => {
                            let className = poke.types.length === 1 ? `circle ${poke.types[ 0 ]}` : `circle ${poke.types[ 1 ]}-main ${poke.types[ 0 ]}-secondary`;
                            const image = <img className={ className }
                                               src={ `data:image/png;base64, ${poke.image}` }
                                               alt={ poke.name } width={ '52px' } height={ '52px' }
                                               onClick={ () => this.onClick(poke, index) }/>;
                            return (<span key={ poke.name } title={ poke.name }>{ image }</span>);
                        }) }
                </div>
            );
        } else {
            return <div className='still-loading'>
                <img src='./pokeball.png' alt='pokeball' className='pokeball'/>
            </div>
        }
    }
}

export default connect(mapStateToProps)(View);