package perobobbot.plugin;
    
import com.google.common.collect.ImmutableSet;
import jplugman.api.Plugin;
import jplugman.api.Requirement;
import jplugman.api.ServiceProvider;
import lombok.NonNull;

public class MyPlugin implements Plugin {

    @Override
    public @NonNull ImmutableSet<Requirement<?>> getRequirements() {
        return ImmutableSet.of();
    }

    @Override
    public @NonNull Class<?> getServiceClass() {
        throw new RuntimeException("TO IMPLEMENT");
    }

    @Override
    public @NonNull Object loadService(@NonNull ModuleLayer pluginLayer, @NonNull ServiceProvider serviceProvider) {
        throw new RuntimeException("TO IMPLEMENT");
    }
}
