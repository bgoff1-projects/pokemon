import React from 'react';
import { connect } from 'react-redux';
import '../Body/Pokemon.css';
import { addPokemonToGrid, removePokemonFromParty, saveParty } from "../../actions";

const mapStateToProps = state => ({
    pokemon: state.pokemon,
    party: state.party
});

class Party extends React.Component {
    static setUp(pokemon) {
        let result = [];
        for (const poke of pokemon) {
            result.push(poke);
        }
        while (result.length < 6) {
            result.push('empty');
        }
        return result;
    }

    onClick(pokemon, index) {
        this.props.dispatch(removePokemonFromParty(index));
        this.props.dispatch(addPokemonToGrid(pokemon));
    }

    saveParty() {
        const newParty = [];
        for (const partyMember of this.props.pokemon.party) {
            newParty.push({...partyMember});
        }
        this.props.dispatch(saveParty(newParty));
    }

    render() {
        const party = Party.setUp(this.props.pokemon.party);
        if (this.props.pokemon.all.length === 0) {
            return null;
        }
        const div = <div>&nbsp;</div>;
        return (
            <div className='text-center'>
                <span className='partyMembers rounded'>
                { party.map((value, index) => {
                    if (value === 'empty') {
                        return <span style={ { 'display': 'inline-block' } } key={ index }><span
                            className='empty'/>{ div }{ div }<br/></span>
                    }
                    let className;
                    let types;
                    if (value.types.length === 1) {
                        className = `circle ${ value.types[ 0 ] }`;
                        types = (<span className={ 'type ' + value.types[ 0 ] }>
                            { value.types[ 0 ] }
                        </span>);
                    } else {
                        className = `circle ${ value.types[ 1 ] }-main ${ value.types[ 0 ] }-secondary`;
                        types = (<span><span className={ 'type ' + value.types[ 1 ] }>
                                { value.types[ 1 ] }
                            </span><span className={ 'type ' + value.types[ 0 ] }>
                            { value.types[ 0 ] }
                        </span></span>);
                    }
                    return <span style={ { 'display': 'inline-block' } } key={ index }>
                        <img className={ className } src={ `data:image/png;base64, ${ value.image }` }
                             alt={ value.name } width={ '96px' } height={ '96px' }
                             onClick={ () => this.onClick(value, index) }/>
                        <div className='name'>
                            { value.name }
                        </div>
                        <div>
                            { types }
                        </div>
                        <br/>
                    </span>
                }) }
                    <img src="/add_team.svg" alt='add team' onClick={() => this.saveParty() }
                         className="addPokemon" title="Add Pokemon To Party"/>
                </span>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Party);
