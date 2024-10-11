import asyncio
import logging
import traceback
from functools import wraps
from typing import Optional

from starlette.requests import Request as BaseRequest
from starlette.responses import JSONResponse

from base.database import ConnectionPool
from base.exceptions import Error, AuthenticationError, AccessError
from base.models import Environment
from values import HttpStatusCode

logger = logging.getLogger(__name__)


class Request(BaseRequest):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.env: Optional[Environment] = None


def session_handler(func):
    @wraps(func)
    def sync_wrapper(*args, **kwargs) -> JSONResponse:
        request: Request = kwargs['request']
        db_session = ConnectionPool.new_session()
        request.env = Environment(db_session=db_session)
        try:
            resp = func(*args, **kwargs)
            db_session.commit()
        except Error as e:
            db_session.rollback()
            traceback.print_exc()
            logger.error(e.__repr__(), exc_info=True)
            resp = JSONResponse(content=e.to_json(), status_code=e.http_code)
        except Exception as e:
            db_session.rollback()
            traceback.print_exc()
            logger.error(e.__repr__(), exc_info=True)
            resp = JSONResponse(content={'error': {'name': 'UnknownError', 'msg': None, 'code': None}},
                                status_code=HttpStatusCode.InternalServerError)
        finally:
            db_session.close()
        return resp

    @wraps(func)
    async def async_wrapper(*args, **kwargs) -> JSONResponse:
        request: Request = kwargs['request']
        db_session = ConnectionPool.new_session(user=None, is_sudo=True)
        request.env = Environment(db_session=db_session)
        try:
            resp = func(*args, **kwargs)
            db_session.commit()
        except Error as e:
            db_session.rollback()
            traceback.print_exc()
            logger.error(e.__repr__(), exc_info=True)
            resp = JSONResponse(content=e.to_json(), status_code=e.http_code)
        except Exception as e:
            db_session.rollback()
            traceback.print_exc()
            logger.error(e.__repr__(), exc_info=True)
            resp = JSONResponse(content={'error': {'name': 'UnknownError', 'msg': None, 'code': None}},
                                status_code=HttpStatusCode.InternalServerError)
        finally:
            db_session.close()
        return resp

    if asyncio.iscoroutine(func):
        return async_wrapper
    else:
        return sync_wrapper


    """
    A decorator function for controllers that checks if the user has the required permission
    to access a specific resource.

    It takes in a permission string as an optional parameter and returns either the user
    if permission is granted or raises an AccessError if permission is denied.

    The decorator function can be used to wrap other functions to enforce permission
    checks before allowing access.

    Ex:
    @app.get('/resource/{resource_id}')
    @require_permission('read_resource')
    def read_resource(request: Request):
        ...

    @app.put('/resource/{resource_id}')
    @require_permission('write_resource')
    def write_resource(request: Request):
        ...
    """
    collect_permission(permission)

    def check_permission(request: Request):
        token = get_bearer_token(request)
        user = request.env['user'].auth(token)
        if not user:
            raise AuthenticationError('Token is invalid', 'AUTH-004')
        if permission is None or user.check_permission(permission):
            return user
        else:
            raise AccessError(f'Permission `{permission}` is required to access this resource', 'PERM-006')

    def decorator(func):
        @wraps(func)
        def sync_wrapper(request: Request, *args, **kwargs):
            user = check_permission(request)
            request.env.user = user
            request.env.is_sudo = False
            # user.env = None
            # request.env = new_env
            return func(request, *args, **kwargs)

        @wraps(func)
        async def async_wrapper(request: Request, *args, **kwargs):
            user = check_permission(request)
            request.env.user = user
            request.env.is_sudo = False
            # user.env = None
            # new_env = Environment(request.env.db_session, user, is_sudo=False)
            # request.env = new_env
            return func(request, *args, **kwargs)

        if asyncio.iscoroutine(func):
            return async_wrapper
        else:
            return sync_wrapper

    return decorator

    """
    A decorator function for controllers that checks if the user has the required for login
    to access a specific resource.

    Parameters:
    - func: The function to be wrapped.

    Returns:
    - sync_wrapper or async_wrapper based on whether the function is synchronous or asynchronous.

    Ex:
    @app.get('/resource/{resource_id}')
    @require_login
    def read_resource(request: Request):
        ...

    @app.put('/resource/{resource_id}')
    @require_login
    def write_resource(request: Request):
        ...
    """

    def check_login(request: Request):
        token = get_bearer_token(request)
        user = request.env['user'].auth(token)
        if not user:
            raise AuthenticationError('Token is invalid', 'AUTH-004')
        return user

    @wraps(func)
    def sync_wrapper(request: Request, *args, **kwargs):
        user = check_login(request)
        request.env.user = user
        return func(request, *args, **kwargs)

    @wraps(func)
    async def async_wrapper(request: Request, *args, **kwargs):
        user = check_login(request)
        request.env.user = user
        return func(request, *args, **kwargs)

    if asyncio.iscoroutine(func):
        return async_wrapper
    else:
        return sync_wrapper
