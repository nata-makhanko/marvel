import React, { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import PropTypes from 'prop-types';
import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false,
    }

    marvelService = new MarvelService();

    componentDidMount = () => {
        this.onRequest();

    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true,
        })
    }
    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }
        this.setState(({ charList, offset }) => {
            return {
                charList: [...charList, ...newCharList],
                loading: false,
                newItemLoading: false,
                offset: offset + 9,
                charEnded: ended
            }
        });
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        })
    }


    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (index) => {
        this.itemRefs.forEach(item => {
            item.classList.remove('char__item_selected');
        });
        this.itemRefs[index].classList.add('char__item_selected');
        this.itemRefs[index].focus();
    }

    renderItems = (arr) => {
        return arr.map((char, index) => {
            const { id, thumbnail, name } = char;
            let imgStyle = { objectFit: 'cover' }
            if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { objectFit: 'contain' }
            }
            return (
                <li tabIndex={0}
                    className="char__item"
                    ref={this.setRef}
                    key={id}
                    onClick={() => { this.props.onCharSelected(id); this.focusOnItem(index) }}>
                    <img src={thumbnail} alt={name} style={imgStyle} />
                    <div className="char__name">{name}</div>
                </li>
            )
        })
    }

    render() {
        const { charList, loading, error, offset, newItemLoading, charEnded } = this.state;
        const items = this.renderItems(charList);
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(errorMessage || spinner) ? items : null;
        return (
            <div className="char__list">
                <ul className="char__grid">
                    {errorMessage}
                    {spinner}
                    {content}
                </ul>
                <button
                    className="button button__main button__long"
                    onClick={() => this.onRequest(offset)}
                    disabled={newItemLoading}
                    style={{ 'display': charEnded ? 'none' : 'block' }}
                >
                    <div className="inner">load more</div>
                </button>
            </div >
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func,
}


export default CharList;