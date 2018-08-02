import axios from 'axios';
import config from '../config/config';



const checkAccessToken = async (req, res, next) => {
    if (!req.header('Authorization')) {
        return res.sendStatus(400);
    }

    const authorizationHeaderParts = req.header('Authorization').split(' ');
    if (authorizationHeaderParts.length !== 2 || authorizationHeaderParts[0] !== 'Bearer') {
        return res.sendStatus(400);
    }

    const accessToken = authorizationHeaderParts[1];

    let user;

    try {
        user = await axios({
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: {"token": accessToken},
            url: config.checkTokenURL,
        })
    } catch (error) {
        if (!error.response) {
            return res.sendStatus(502)
        }

        if (error.response && error.response.status >= 400) {
            return res.status(error.response.status).send(error.response.data)
        }

        return next(error);
    }

    req.user = user;

    return next();
}

export default checkAccessToken;
