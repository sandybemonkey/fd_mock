import axios from 'axios';
import config from '../config/config';

const checkAccessToken = async (req, res, next) => {
    const accessToken = req.header('Authorization') && req.header('Authorization').split(' ')[1];
    if (!accessToken) {
        return res.sendStatus(400);
    }

    let user;

    try {
        user = await axios({
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: {"token": accessToken},
            url: config.checkTokenURL,
        })
    } catch (error) {
        if (error.response.status ) {

        }
        throw error;

    }

    console.log(user, 'user');

    return next();
}

export default checkAccessToken;