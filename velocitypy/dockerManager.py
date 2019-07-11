import docker
import time
from collections import defaultdict
import mongoclient as mongoclient
import tarfile
import io,os
from collections import Counter
def stopAll():
    for container in client.containers.list():
        container.stop()
def make_tarfile(output_filename, source_dir):
    with tarfile.open(output_filename, "w:gz") as tar:
        tar.add(source_dir, arcname=os.path.basename(source_dir))
def runContainter(name):

    return client.containers.run(name, detach=True)
def saveZipToContainer(repository):
    client = docker.from_env()
    container = client.containers.run("ivanjacobs/velocityserver", detach=True)
    with open('exportmodel.tar.gz', 'rb') as fin:
        data = io.BytesIO(fin.read())
        container.put_archive("docker_service", data)
    container.commit(repository=repository)
    # container.stop()
if __name__ == '__main__':
    # saveZipToContainer('ivanjacobs/objects')
    services=[]
    client = docker.from_env()
    cl = docker.APIClient(base_url='unix://var/run/docker.sock')
    for i in client.services.list():
        for x in i.attrs['Endpoint']['Ports']:
          print x

    #  docker service create --name imgserv --publish 443:443 --replicas 3 ivanjacobs/server
    # //client = docker.APIClient(base_url='unix://var/run/docker.sock')
    # while 'ivanjacobs/demo:latest' in [i['Image'] for i in client.containers()]:
    #     print client.stats(i['Id'], stream=False)
    #     time.sleep(2)


    # for cont in client.containers():
    #     print cont['Labels']['com.docker.swarm.service.name']

    # while 'Demo' in [cont['Labels']['com.docker.swarm.service.name'] for cont in client.containers()]:
    #     print  client.stats(cont['Id'], stream=False)
    #     time.sleep(2)
    # servicename='Demo'
    # for l in [i['Labels']['com.docker.swarm.service.name']for i in client.containers()]:
    #   if(l==servicename):
    #       print client.stats(i['Id'], stream=False)

    # for l in [i['Id'] for i in client.containers() if i['Labels']['com.docker.swarm.service.name']=='Demo']:
    #    print client.stats(i['Id'], stream=False)['precpu_stats']

    # while 'Demo' in [i['Labels']['com.docker.swarm.service.name'] for i  in client.containers()]:
    #     try:
    #         stats=client.services(i['Id'],stream=False)
    #     except:
    #         break
    #     print stats
    #     time.sleep(0.5)



    # saveZipToContainer('ivanjacobs/demo')
    # container=runContainter("ivanjacobs/velocityserver")
    # with open('exportmodel.tar.gz', 'rb') as fin:
    #     data = io.BytesIO(fin.read())
    #     container.put_archive("docker_service",data)
    # container.commit(repository='ivanjacobs/velocity')
    # for line in container.logs(stream=True):
    #     print line

    # client.services.create(image='velocity/test',
    #                        publish='443:443')

    # container_spec = docker.types.ContainerSpec(
    # image='velocity/test', env=['publish', '443:443']
    #  )
    # task_tmpl = docker.types.TaskTemplate(container_spec)
    # service_id = client.services.create(image='velocity/test',endpoint_spec=['Ports','443','443'])