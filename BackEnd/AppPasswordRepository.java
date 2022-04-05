package com.twyk.myWebApplication.repository;

import com.twyk.myWebApplication.database.bean.AppPassword;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppPasswordRepository extends JpaRepository<AppPassword, String> {

}
