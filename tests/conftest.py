# Auto-generated conftest
import pytest

@pytest.fixture(scope='session')
def base_url(request):
    return request.config.getoption('--base-url')
