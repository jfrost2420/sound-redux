import React, {Component, PropTypes} from 'react';
import {playSong} from '../actions/player';

import Followings from '../components/Followings';
import SongCard from '../components/SongCard';
import Spinner from '../components/Spinner';
import Stickify from '../components/Stickify';

import {addCommas, getSocialIcon} from '../helpers/Formatter';
import {getImageUrl} from '../helpers/SongsHelper';
import {getUserLocation} from '../helpers/UsersHelper';

class User extends Component {
    playSong(i) {
        const {dispatch, user} = this.props;
        dispatch(playSong(user.username, i));
    }

    renderFollowings() {
        const {dispatch, height, user} = this.props;
        if (!user.followings) {
            return;
        }

        return <Followings dispatch={dispatch} height={height} users={user.followings} />;
    }

    renderSongs() {
        const {dispatch, player, playingSong, songs} = this.props;
        if (!songs.items) {
            return;
        }

        const items = songs.items.map((song, i) => {
            return (
                <SongCard
                    dispatch={dispatch}
                    isActive={playingSong.id === song.id}
                    key={song.id}
                    player={player}
                    playSong={this.playSong.bind(this, i)}
                    song={song} />
            );
        });

        return (
            <div className='tab-content'>
                {items}
            </div>
        );
    }

    renderUserProfiles() {
        const {profiles} = this.props.user;
        if (!profiles) {
            return;
        }

        return profiles.slice(0,6).map(profile => {
            return (
                <div className='user-profile' key={profile.id}>
                    <i className={'icon ' + getSocialIcon(profile.service)}></i>
                    <a href={profile.url} target='_blank'>{profile.title}</a>
                </div>
            );
        });
    }

    render() {
        const {sticky, user} = this.props;

        if (user.isFetching) {
            return <Spinner />;
        }

        const image = user.avatar_url ? getImageUrl(user.avatar_url) : null;
        return (
            <div className='container'>
                <div className='content'>
                    <div className='grid'>
                        <div className='col-7-10'>
                            <div className='user card'>
                                <div className='user-detail'>
                                    <img className='user-image' src={image} />
                                </div>
                                <div className='user-info'>
                                    <div className='user-username'>{user.username}</div>
                                    <div className='user-location'>
                                        <i className='icon ion-location'></i>
                                        {getUserLocation(user)}
                                    </div>
                                    <div className='user-profiles'>
                                        <div className='user-profile'>{addCommas(user.followers_count) + ' followers'}</div>
                                        {this.renderUserProfiles()}
                                    </div>
                                    <div className='user-description' dangerouslySetInnerHTML={{__html: user.description}}></div>
                                </div>
                            </div>
                            {this.renderSongs()}
                        </div>
                        <div className='col-3-10'>
                            <div className={'sidebar' + (sticky ? ' sticky' : '')}>
                                {this.renderFollowings()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

User.propTypes = {
    user: PropTypes.object.isRequired
};

export default Stickify(User, 50);
