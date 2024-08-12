package com.rest.service;

import com.rest.model.User;
import com.rest.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByLogin(String login) {
        return userRepository.findByLogin(login);
    }

    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        user.setLogin(userDetails.getLogin());
        user.setEmail(userDetails.getEmail());
        user.setPassword(userDetails.getPassword());
        user.setCurrency(userDetails.getCurrency());
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
