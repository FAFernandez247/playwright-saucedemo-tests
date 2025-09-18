import { faker } from '@faker-js/faker';

export function generateTestUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const zipCode = faker.location.zipCode();
  

  return {
    firstName: firstName,
    lastName: lastName,
    zipCode: zipCode,
  };
}