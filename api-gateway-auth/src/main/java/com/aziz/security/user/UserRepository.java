package com.aziz.security.user;

import java.util.List;
import java.util.Optional;

import com.aziz.security.role.Role;
import com.aziz.security.user.dto.UserDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Integer> {

  Optional<User> findByEmail(String email);
  Optional<User> findUserByEmailOrPhone(String email,String phone);
  Integer countUsersByRole(Role role);

  Optional<List<User>> findAllByLineWorkingId(Integer id);
  Optional<User> findUserByLineManagingId(Integer id);
  Optional<User> findUserBySegmentManagingId(Integer id);
  Optional<User> findUserByPlantManagingId(Integer id);
  Optional<User> findUserByProductSectionManagingId(Integer id);

  @Query("SELECT new com.aziz.security.user.dto.UserDTO(u.id, u.firstname, u.lastname, u.email, u.phone, u.role.name, u.enable, u.archived) FROM User u")
  List<UserDTO> findAllUserDTOs();




}
