import docker


def get_docker_client() -> docker.DockerClient:
    return docker.from_env()
