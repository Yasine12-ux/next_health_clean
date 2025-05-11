# healthcare-pfe
HealthCare platform | PFE
"test" 

run postgres container
```bash
docker run -d -p 5433:5432 -e POSTGRES_PASSWORD=admin -e POSTGRES_USER=admin -e POSTGRES_DB=jwt_security -v "D:\STUDY\Genie Logiciel ISIMM\DevPFE\backend:/var/lib/postgresql/data" --name=pfe_postgres postgres
docker inspect pfe_postgres # get ip address
```